'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { Camera, ClipboardCopy, Loader2, Upload, FileText, ArrowRight, RefreshCw, BookText } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { indianScripts } from '@/lib/scripts';
import { handleDetectScriptAndExtractText, handleTransliterate, handleGetMeaning } from './actions';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

type State = {
  imagePreview: string | null;
  sourceScript: string | null;
  targetScript: string;
  inputText: string;
  outputText: string | null;
  meaning: string | null;
  isLoading: boolean;
  isLoadingTransliteration: boolean;
  isLoadingMeaning: boolean;
  showCamera: boolean;
  hasCameraPermission: boolean | null;
  isMeaningDialogOpen: boolean;
};

const initialState: State = {
  imagePreview: null,
  sourceScript: null,
  targetScript: '',
  inputText: '',
  outputText: null,
  meaning: null,
  isLoading: false,
  isLoadingTransliteration: false,
  isLoadingMeaning: false,
  showCamera: false,
  hasCameraPermission: null,
  isMeaningDialogOpen: false,
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
    setState(prev => ({ ...prev, isLoading: true, imagePreview: URL.createObjectURL(file), inputText: '' }));

    const formData = new FormData();
    formData.append('image', file);

    const result = await handleDetectScriptAndExtractText(formData);

    if (result.success) {
      setState(prev => ({ ...prev, sourceScript: result.script!, inputText: result.text!, isLoading: false, outputText: null, meaning: null }));
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
    setState(prev => ({ ...prev, isLoadingTransliteration: true, outputText: null, meaning: null }));

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

  const onGetMeaning = async () => {
    if (!state.outputText || !state.targetScript) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please transliterate text first and select a target script.',
      });
      return;
    }
    setState(prev => ({ ...prev, isLoadingMeaning: true }));

    const result = await handleGetMeaning({
      text: state.outputText,
      language: state.targetScript,
    });

    if (result.success) {
      setState(prev => ({ ...prev, meaning: result.meaning, isLoadingMeaning: false, isMeaningDialogOpen: true }));
    } else {
      toast({
        variant: 'destructive',
        title: 'Could not get meaning',
        description: result.error,
      });
      setState(prev => ({ ...prev, isLoadingMeaning: false }));
    }
  };


  const copyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast({
        title: 'Copied to Clipboard',
      });
    }
  };
  
  const resetState = () => {
    setState(initialState);
    if(fileInputRef.current) fileInputRef.current.value = '';
  }

  const hasContent = state.imagePreview || state.inputText;

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          {!hasContent && !state.showCamera && (
            <div className="p-8 text-center border-2 border-dashed rounded-xl border-border bg-secondary/30">
              <h3 className="mb-6 text-xl font-semibold">Start by providing text or an image</h3>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2" /> Upload Image
                </Button>
                <Button size="lg" onClick={() => setState(p => ({...p, showCamera: true}))} variant="secondary">
                  <Camera className="mr-2" /> Open Camera
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              </div>
            </div>
          )}

          {state.showCamera && (
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
          )}
          
          {hasContent && !state.showCamera && (
             <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-4">
                    {state.imagePreview && (
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
                         </div>
                    )}
                    <Card>
                        <CardHeader>
                            <CardTitle>Input Text</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea 
                                value={state.inputText}
                                onChange={(e) => setState(p => ({...p, inputText: e.target.value}))}
                                placeholder="Enter text here or upload an image"
                                className="min-h-[150px] text-lg"
                            />
                             {state.sourceScript && (
                                <div className="mt-4 text-sm text-muted-foreground">
                                    Detected Script: <span className="font-semibold text-foreground">{state.sourceScript}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                     <Button onClick={resetState} variant="outline" className="w-full">
                        <RefreshCw className="mr-2" /> Start Over
                    </Button>
                </div>
                <div className="space-y-6">
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

                    {(state.isLoadingTransliteration) && (
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
                            onClick={() => copyToClipboard(state.outputText || '')}
                            >
                            <ClipboardCopy />
                            </Button>
                        </div>
                        <div className="p-4 rounded-lg bg-background">
                            <p className="text-xl font-medium text-foreground">{state.outputText}</p>
                        </div>
                        <Button 
                            onClick={onGetMeaning}
                            disabled={state.isLoadingMeaning}
                            variant="link" 
                            className="mt-2 p-0 h-auto"
                        >
                            {state.isLoadingMeaning ? (
                                <>
                                <Loader2 className="mr-2 animate-spin"/>
                                Getting Meaning...
                                </>
                            ): (
                                <>
                                <BookText className="mr-2"/>
                                Get Meaning
                                </>
                            )}
                        </Button>
                        </Card>
                    )}
                </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={state.isMeaningDialogOpen} onOpenChange={(isOpen) => setState(p => ({...p, isMeaningDialogOpen: isOpen}))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Meaning of the Text</DialogTitle>
            <DialogDescription>
              Here is the definition of the transliterated text in {state.targetScript}.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 mt-2 border rounded-lg bg-secondary/30">
            <p>{state.meaning}</p>
          </div>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
