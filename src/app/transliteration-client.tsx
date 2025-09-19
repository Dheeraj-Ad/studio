'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { Camera, ClipboardCopy, Loader2, Upload, FileText } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { indianScripts } from '@/lib/scripts';
import { handleDetectScript, handleTransliterate } from './actions';
import { Separator } from '@/components/ui/separator';

type State = {
  imagePreview: string | null;
  sourceScript: string | null;
  targetScript: string;
  inputText: string;
  outputText: string | null;
  isLoadingDetection: boolean;
  isLoadingTransliteration: boolean;
};

const initialState: State = {
  imagePreview: null,
  sourceScript: null,
  targetScript: '',
  inputText: '',
  outputText: null,
  isLoadingDetection: false,
  isLoadingTransliteration: false,
};

export default function TransliterationClient() {
  const [state, setState] = useState<State>(initialState);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setState(prev => ({ ...prev, isLoadingDetection: true, imagePreview: URL.createObjectURL(file) }));

    const formData = new FormData();
    formData.append('image', file);

    const result = await handleDetectScript(formData);

    if (result.success) {
      setState(prev => ({ ...prev, sourceScript: result.script!, isLoadingDetection: false }));
    } else {
      toast({
        variant: 'destructive',
        title: 'Script Detection Failed',
        description: result.error,
      });
      setState(prev => ({ ...prev, isLoadingDetection: false, imagePreview: null }));
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
    if(cameraInputRef.current) cameraInputRef.current.value = '';
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
          {!state.imagePreview ? (
            <div className="p-8 text-center border-2 border-dashed rounded-lg border-border">
              <h3 className="mb-4 text-lg font-medium">Start by providing an image</h3>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2" /> Upload from Device
                </Button>
                <Button onClick={() => cameraInputRef.current?.click()} variant="secondary">
                  <Camera className="mr-2" /> Capture with Camera
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                <input type="file" ref={cameraInputRef} onChange={handleImageChange} accept="image/*" capture="environment" className="hidden" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative w-full overflow-hidden border rounded-lg aspect-video border-border">
                <Image src={state.imagePreview} alt="Uploaded text" layout="fill" objectFit="contain" />
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-4 rounded-md bg-secondary">
                  <Label className="text-sm font-semibold text-muted-foreground">Detected Script</Label>
                  {state.isLoadingDetection ? (
                    <div className="flex items-center gap-2 mt-1">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <p className="text-lg font-medium">Detecting...</p>
                    </div>
                  ) : (
                    <p className="text-lg font-semibold text-accent">{state.sourceScript || 'N/A'}</p>
                  )}
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
                        <SelectItem key={script.value} value={script.value}>
                          {script.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="input-text" className="text-sm font-semibold text-muted-foreground">
                  Text to Transliterate
                </Label>
                <Textarea
                  id="input-text"
                  placeholder="Type the text you see in the image here..."
                  className="mt-1"
                  rows={4}
                  value={state.inputText}
                  onChange={(e) => setState(prev => ({...prev, inputText: e.target.value}))}
                  disabled={!state.sourceScript}
                />
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
          )}

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
