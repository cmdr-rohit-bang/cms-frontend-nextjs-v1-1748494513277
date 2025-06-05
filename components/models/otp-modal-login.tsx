import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Phone } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const OtpModalLogin = ({
  isOtpModalOpen,
  setIsOtpModalOpen,
}: {
  isOtpModalOpen: boolean;
  setIsOtpModalOpen: (value: boolean) => void;
}) => {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    if (!mobileNumber || mobileNumber.length < 10) {
      toast.error("Please enter a valid mobile number");
      return;
    }
    try {
      // Simulate API call to resend OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("OTP sent successfully!");
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setIsSendingOtp(false);
      setShowOtpInput(true);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    // setIsVerifying(true);
    // try {
    //   const verificationResult = await verifyOTP(mobileNumber, otp);
    
    //   const formData = new FormData();
    //   if (verificationResult.status === "success") {
        
    //     formData.set("mobileNumber", mobileNumber);
    //     const result = await createTicketWithContact(formData, true);
  
    //     if (result.status === "success") {
    //       toast.success("Login successfully!");
    //       setIsOtpModalOpen(false);
    //       router.push(`/ticket/my-tickets`);
    //     } else {
    //       toast.error(result.message);
    //     }
    //   } else {
    //     toast.error("Invalid OTP. Please try again.");
    //   }

      
    // } catch (error:any) {
    //   toast.error(error.message);
    // } finally {
    //   setIsVerifying(false);
    // }
  };

  return (
    <Dialog
      open={isOtpModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          setMobileNumber("");
          setOtp("");
          setShowOtpInput(false);
          setIsVerifying(false);
          setIsSendingOtp(false);
        }
        setIsOtpModalOpen(open);
      }}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Verify Your Mobile Number</DialogTitle>
          <DialogDescription>
            {!showOtpInput
              ? "Please enter your mobile number to receive verification code"
              : `We've sent a 6-digit verification code to ${mobileNumber}`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!showOtpInput ? (
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <Label htmlFor="mobile">Mobile Number</Label>
              </div>
              <Input
                id="mobile"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChange={(e) =>
                  setMobileNumber(
                    e.target.value.replace(/\D/g, "").slice(0, 10)
                  )
                }
                className="text-center text-lg"
                maxLength={10}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <Label htmlFor="otp">Enter Verification Code</Label>
              </div>
              <Input
                id="otp"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?{" "}
                <Button type="button" variant={"link"} onClick={handleSendOtp}>
                  Resend
                </Button>
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsOtpModalOpen(false);
              setMobileNumber("");
              setOtp("");
              setShowOtpInput(false);
              setIsVerifying(false);
              setIsSendingOtp(false);
            }}
          >
            Cancel
          </Button>
          {!showOtpInput ? (
            <Button onClick={handleSendOtp} disabled={isSendingOtp}>
              {isSendingOtp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          ) : (
            <Button onClick={handleVerifyOtp} disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Submit"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OtpModalLogin;
