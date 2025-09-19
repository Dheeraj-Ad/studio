'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { Camera, ClipboardCopy, Loader2, Upload, FileText, ArrowRight, RefreshCw } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { indianScripts } from '@/lib/scripts';
import { handleDetectScriptAndExtractText, handleTransliterate } from './actions';
import { Separator } from '@/components/ui/separator';

type State = {
  imagePreview: string | null;
  sourceScript: string | null;
  targetScript: string;
  inputText: string;
  outputText: string | null;
  isLoading: boolean;
  isLoadingTransliteration: boolean;
  showCamera: boolean;
  hasCameraPermission: boolean | null;
};

const initialState: State = {
  imagePreview: null,
  sourceScript: null,
  targetScript: '',
  inputText: '',
  outputText: null,
  isLoading: false,
  isLoadingTransliteration: false,
  showCamera: false,
  hasCameraPermission: null,
};

export default function TransliterationClient() {
  const [state, setState] = useState<State>(initialState);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (state.showCamera) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({video: true});
          setState(prev => ({ ...prev, hasCameraPermission: true}));

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setState(prev => ({ ...prev, hasCameraPermission: false}));
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this app.',
          });
        }
      };

      getCameraPermission();
      
      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
      }
    }
  }, [state.showCamera, toast]);


  const processImageFile = async (file: File) => {
    setState(prev => ({ ...prev, isLoading: true, imagePreview: URL.createObjectURL(file) }));

    const formData = new FormData();
    formData.append('image', file);

    const result = await handleDetectScriptAndExtractText(formData);

    if (result.success) {
      setState(prev => ({ ...prev, sourceScript: result.script!, inputText: result.text!, isLoading: false }));
    } else {
      toast({
        variant: 'destructive',
        title: 'Processing Failed',
        description: result.error,
      });
      setState(prev => ({ ...prev, isLoading: false, imagePreview: null }));
    }
  }

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await processImageFile(file);
  };
  
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], "capture.png", { type: "image/png" });
            setState(prev => ({ ...prev, showCamera: false }));
            await processImageFile(file);
          }
        }, 'image/png');
      }
    }
  };


  const onTransliterate = async () => {
    if (!state.sourceScript || !state.targetScript || !state.inputText) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please ensure source script is detected, target script is selected, and text is entered.',
      });
      return;
    }
    setState(prev => ({ ...prev, isLoadingTransliteration: true }));

    const result = await handleTransliterate({
      sourceScript: state.sourceScript,
      targetScript: state.targetScript,
      text: state.inputText,
    });

    if (result.success) {
      setState(prev => ({ ...prev, outputText: result.transliteratedText, isLoadingTransliteration: false }));
    } else {
      toast({
        variant: 'destructive',
        title: 'Transliteration Failed',
        description: result.error,
      });
      setState(prev => ({ ...prev, isLoadingTransliteration: false }));
    }
  };

  const copyToClipboard = () => {
    if (state.outputText) {
      navigator.clipboard.writeText(state.outputText);
      toast({
        title: 'Copied to Clipboard',
        description: 'The transliterated text has been copied.',
      });
    }
  };
  
  const resetState = () => {
    setState(initialState);
    if(fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-4xl">
        {!state.imagePreview && !state.showCamera && (
          <Card className="p-8 text-center border-2 border-dashed rounded-xl border-border bg-secondary/30">
            <h3 className="mb-6 text-xl font-semibold">Start by providing an image</h3>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2" /> Upload from Device
              </Button>
              <Button size="lg" onClick={() => setState(p => ({...p, showCamera: true}))} variant="secondary">
                <Camera className="mr-2" /> Open Camera
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            </div>
          </Card>
        )}

        {state.showCamera && (
          <Card className="p-6 space-y-4 rounded-xl">
            <div className="relative w-full overflow-hidden border rounded-lg aspect-video border-border bg-black">
               <video ref={videoRef} className="w-full h-full" autoPlay muted playsInline />
               <canvas ref={canvasRef} className="hidden" />
            </div>
             { state.hasCameraPermission === false && (
                <Alert variant="destructive">
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access to use this feature. You may need to refresh the page and grant permission.
                  </AlertDescription>
                </Alert>
              )}
            <div className="flex flex-col gap-4 sm:flex-row">
               <Button onClick={handleCapture} disabled={!state.hasCameraPermission}>
                <Camera className="mr-2" /> Capture Image
              </Button>
               <Button onClick={() => setState(p => ({...p, showCamera: false}))} variant="outline">
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {state.imagePreview && !state.showCamera && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <Card className="relative w-full overflow-hidden rounded-xl aspect-square">
                  {state.isLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-sm">
                      <Loader2 className="w-10 h-10 animate-spin text-primary" />
                      <p className="text-lg font-medium">Analyzing Image...</p>
                    </div>
                  )}
                  <Image src={state.imagePreview} alt="Uploaded text" layout="fill" objectFit="contain" />
              </Card>
              <Button onClick={resetState} variant="outline" className="w-full">
                <RefreshCw className="mr-2" /> Start Over
              </Button>
            </div>
            
            <div className="space-y-6">
              <Card className="p-6 rounded-xl">
                <Label className="text-sm font-semibold text-muted-foreground">Detected Text</Label>
                <div className="mt-2 p-4 min-h-[120px] w-full rounded-lg bg-secondary/50 text-lg leading-relaxed">
                  {state.inputText || "No text detected."}
                </div>
              </Card>

              <div className="flex items-end gap-4">
                  <div className="flex-1">
                     <Label htmlFor="target-script" className="text-sm font-semibold text-muted-foreground">Target Script</Label>
                     <Select
                      value={state.targetScript}
                      onValueChange={(value) => setState(prev => ({...prev, targetScript: value}))}
                      disabled={!state.sourceScript}
                    >
                      <SelectTrigger id="target-script" className="mt-1 font-semibold text-base h-12">
                        <SelectValue placeholder="Choose a script" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianScripts.map((script) => (
                          <SelectItem key={script.value} value={script.value} disabled={script.value === state.sourceScript}>
                            {script.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                   <Button size="lg" onClick={onTransliterate} disabled={state.isLoadingTransliteration || !state.sourceScript || !state.inputText || !state.targetScript} className="h-12">
                    {state.isLoadingTransliteration ? (
                      <Loader2 className="animate-spin" />
                    ) : <ArrowRight />}
                  </Button>
              </div>

              {state.isLoadingTransliteration && (
                 <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="animate-spin" />
                  <span>Transliterating...</span>
                </div>
              )}

              {state.outputText && (
                <Card className="p-6 rounded-xl bg-primary/5">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold mb-2">Transliterated Text</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                      onClick={copyToClipboard}
                    >
                      <ClipboardCopy />
                    </Button>
                  </div>
                  <div className="p-4 rounded-lg bg-background">
                    <p className="text-xl font-medium text-foreground">{state.outputText}</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
