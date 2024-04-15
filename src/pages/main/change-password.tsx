import { useState } from "react";
import { Button } from "@/components/ui/button";
// import Admin from "@/components/layout/Admin";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input";
import { getAdminServerSideProps as getServerSideProps } from "@/util/api/getServerSideProps";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    const response = await fetch("/api/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    if (!response.ok) {
      const body = await response.json();
      setErrorMsg(body.message);
    } else {
      setSuccessMsg("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setErrorMsg("");
      setConfirmPassword("");
    }
  };

  return (
    <>
      <div className="flex flex-col items-start gap-6">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button onClick={handleChangePassword}>Change Password</Button>
        {errorMsg && <div className="panel-error">{errorMsg}</div>}
        {successMsg && <div className="panel-success">{successMsg}</div>}
      </div>
    </>
  );
};

export default ChangePassword;
export { getServerSideProps };
