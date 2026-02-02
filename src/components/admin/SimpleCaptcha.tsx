import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface SimpleCaptchaProps {
  onVerified: (isValid: boolean) => void;
}

const generateChallenge = () => {
  const operators = ["+", "-", "×"] as const;
  const operator = operators[Math.floor(Math.random() * operators.length)];
  
  let num1: number, num2: number, answer: number;
  
  switch (operator) {
    case "+":
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      answer = num1 + num2;
      break;
    case "-":
      num1 = Math.floor(Math.random() * 20) + 10;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 - num2;
      break;
    case "×":
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 * num2;
      break;
    default:
      num1 = 1;
      num2 = 1;
      answer = 2;
  }
  
  return { num1, num2, operator, answer };
};

export function SimpleCaptcha({ onVerified }: SimpleCaptchaProps) {
  const [challenge, setChallenge] = useState(generateChallenge);
  const [userAnswer, setUserAnswer] = useState("");
  const [hasAttempted, setHasAttempted] = useState(false);

  const refreshChallenge = useCallback(() => {
    setChallenge(generateChallenge());
    setUserAnswer("");
    setHasAttempted(false);
    onVerified(false);
  }, [onVerified]);

  useEffect(() => {
    if (userAnswer === "") {
      onVerified(false);
      return;
    }
    
    const isCorrect = parseInt(userAnswer, 10) === challenge.answer;
    setHasAttempted(true);
    onVerified(isCorrect);
  }, [userAnswer, challenge.answer, onVerified]);

  const isCorrect = hasAttempted && parseInt(userAnswer, 10) === challenge.answer;
  const isWrong = hasAttempted && userAnswer !== "" && !isCorrect;

  return (
    <div className="space-y-2">
      <Label htmlFor="captcha">Verifikasi Keamanan</Label>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 bg-muted px-4 py-2 rounded-md font-mono text-lg select-none">
          {challenge.num1} {challenge.operator} {challenge.num2} = ?
        </div>
        <Input
          id="captcha"
          type="number"
          inputMode="numeric"
          placeholder="Jawaban"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className={`w-24 ${isCorrect ? "border-green-500 focus-visible:ring-green-500" : ""} ${isWrong ? "border-destructive focus-visible:ring-destructive" : ""}`}
          required
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={refreshChallenge}
          title="Ganti soal"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      {isWrong && (
        <p className="text-sm text-destructive">Jawaban salah, coba lagi.</p>
      )}
      {isCorrect && (
        <p className="text-sm text-green-600">✓ Verifikasi berhasil</p>
      )}
    </div>
  );
}
