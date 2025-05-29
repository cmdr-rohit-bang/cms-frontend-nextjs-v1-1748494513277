import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";
import { Check } from "lucide-react";
import { X } from "lucide-react";

const SubDomainCheck = ({
  subdomainAvailable,
  setSubdomainAvailable,
  setSubdomain,
}: {
  subdomainAvailable: boolean | null;
  setSubdomainAvailable: (subdomain: boolean | null) => void;
  setSubdomain: (subdomain: string) => void;
}) => {
  const [formData, setFormData] = useState({
    subdomain: "",
  });
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);


  const checkSubdomainAvailability = async () => {
    let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenant/check-subdomain/${formData.subdomain}`);
    let data = await response.json();
    console.log(data);
    setCheckingSubdomain(false);
    setSubdomainAvailable(data.available);
    setSubdomain(formData.subdomain);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: newValue,
    });
    // Reset subdomain availability if input is cleared
    if (newValue === "") {
      setSubdomainAvailable(null);
      setSubdomain("");
    }
  };
  return (
    <div>
      <Label htmlFor="subdomain">Choose Your Subdomain</Label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            id="subdomain"
            name="subdomain"
            value={formData.subdomain}
            onChange={handleChange}
            placeholder="your-company"
            className="pr-24"
            required
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            .flexicms.com
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={checkSubdomainAvailability}
          disabled={!formData.subdomain || checkingSubdomain}
        >
          {checkingSubdomain ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Check"
          )}
        </Button>
      </div>
      {/* Subdomain availability indicator */}
      {subdomainAvailable !== null && (
        <div className="mt-2 flex items-center gap-2">
          {subdomainAvailable ? (
            <>
              <Check size={16} className="text-green-500" />
              <p className="text-sm text-green-500">
                {formData.subdomain}.flexicms.com is available!
              </p>
            </>
          ) : (
            <>
              <X size={16} className="text-red-500" />
              <p className="text-sm text-red-500">
                This subdomain is already taken. Try another one.
              </p>
            </>
          )}
        </div>
      )}

    </div>
  );
};

export default SubDomainCheck;
