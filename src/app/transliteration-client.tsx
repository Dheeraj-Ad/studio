'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { Camera, ClipboardCopy, Loader2, Upload, FileText } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <span>Transliteration Tool</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!state.imagePreview && !state.showCamera ? (
            <div className="p-8 text-center border-2 border-dashed rounded-lg border-border">
              <h3 className="mb-4 text-lg font-medium">Start by providing an image</h3>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2" /> Upload from Device
                </Button>
                <Button onClick={() => setState(p => ({...p, showCamera: true}))} variant="secondary">
                  <Camera className="mr-2" /> Open Camera
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              </div>
            </div>
          ) : null}

          {state.showCamera ? (
            <div className="space-y-4">
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
            </div>
          ) : null}

          {state.imagePreview && !state.showCamera ? (
            <div className="space-y-4">
              <div className="relative w-full overflow-hidden border rounded-lg aspect-video border-border">
                {state.isLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/80">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-lg font-medium">Analyzing Image...</p>
                  </div>
                )}
                <Image src={state.imagePreview} alt="Uploaded text" layout="fill" objectFit="contain" />
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-4 rounded-md bg-secondary">
                  <Label className="text-sm font-semibold text-muted-foreground">Detected Script</Label>
                  <p className="text-lg font-semibold text-accent">{state.sourceScript || 'N/A'}</p>
                </div>
                <div className="p-4 rounded-md bg-secondary">
                   <Label htmlFor="target-script" className="text-sm font-semibold text-muted-foreground">Select Target Script</Label>
                   <Select
                    value={state.targetScript}
                    onValueChange={(value) => setState(prev => ({...prev, targetScript: value}))}
                    disabled={!state.sourceScript}
                  >
                    <SelectTrigger id="target-script" className="mt-1 font-semibold">
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
              </div>
              
              <div>
                <Label htmlFor="input-text" className="text-sm font-semibold text-muted-foreground">
                  Detected Text
                </Label>
                <div
                  id="input-text"
                  className="mt-1 p-3 min-h-[80px] w-full rounded-md border border-input bg-muted"
                >
                  {state.inputText || "No text detected."}
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                 <Button onClick={onTransliterate} disabled={state.isLoadingTransliteration || !state.sourceScript || !state.inputText || !state.targetScript} className="w-full sm:w-auto">
                  {state.isLoadingTransliteration ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" /> Transliterating...
                    </>
                  ) : "Transliterate"}
                </Button>
                 <Button onClick={resetState} variant="outline" className="w-full sm:w-auto">
                  Start Over
                </Button>
              </div>
            </div>
          ) : null}

          {state.outputText && (
            <>
              <Separator />
              <div className="p-4 space-y-2 rounded-lg bg-background">
                <h3 className="text-lg font-semibold">Transliterated Text</h3>
                <Card className="relative p-4 shadow-inner bg-secondary">
                  <p className="text-xl font-medium text-accent-foreground">{state.outputText}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={copyToClipboard}
                  >
                    <ClipboardCopy />
                  </Button>
                </Card>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
