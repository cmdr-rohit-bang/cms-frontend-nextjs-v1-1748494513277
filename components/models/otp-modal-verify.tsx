'use client'
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

const OtpModalVerify = ({
  isOtpModalOpen,
  setIsOtpModalOpen,
  formData,
}: {
  isOtpModalOpen: boolean;
  setIsOtpModalOpen: (value: boolean) => void;
  formData: FormData | null;
}) => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const handleResendOtp = async () => {
    setIsVerifying(true);
    try {
      // Simulate API call to resend OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("OTP resent to your mobile number");
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
    finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

   
    // setIsVerifying(true);
    // try {
    //   // Verify OTP
    //   const verificationResult = await verifyOTP(
    //     formData?.get("mobileNumber") as string,
    //     otp
    //   );

    //   if (verificationResult.status === "success") {
    //     if (!formData) {
    //       toast.error("Form data is missing");
    //       return;
    //     }
    //     // Create ticket with contact
    //     const result = await createTicketWithContact(formData, false);

    //     if (result.status === "success") {
    //       const ticketData = result.data as TicketResponse;
    //       toast.success("Ticket created  successfully!");
    //       setIsOtpModalOpen(false);
    //       router.push(`/ticket/success?id=${ticketData?.id}`);
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
    <div>
      <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Verify Your Mobile Number</DialogTitle>
            <DialogDescription>
              We've sent a 6-digit verification code to
              {`+${formData?.get("countryCode")}${formData?.get(
                "mobileNumber"
              )}`}
              .
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
            </div>
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                className="font-medium text-primary hover:underline"
              >
                Resend
              </button>
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOtpModalOpen(false)}
              disabled={isVerifying}
            >
              Cancel
            </Button>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OtpModalVerify;
