"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Shield, KeyRound, Power, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  updateUserRoleAction,
  toggleUserStatusAction,
  resetUserPasswordAction,
} from "../user.actions";

interface RoleOption {
  id: string;
  name: string;
}

interface UserRowActionsProps {
  user: {
    id: string;
    name: string;
    email: string;
    status: string;
    currentRoleId?: string;
  };
  roles: RoleOption[];
  currentUserId: string;
}

export function UserRowActions({ user, roles, currentUserId }: UserRowActionsProps) {
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.currentRoleId || roles[0]?.id || "");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isSelf = user.id === currentUserId;

  const handleRoleUpdate = async () => {
    setLoading(true);
    try {
      const res = await updateUserRoleAction(user.id, selectedRole);
      if (res.success) {
        toast.success(res.message || "Role updated successfully");
        setRoleDialogOpen(false);
      } else {
        toast.error(res.error || "Failed to update role");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    if (isSelf) {
      toast.error("You cannot deactivate your own account");
      return;
    }

    setLoading(true);
    try {
      const res = await toggleUserStatusAction(user.id, user.status);
      if (res.success) {
        toast.success(res.message || "Status updated");
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await resetUserPasswordAction(user.id, newPassword);
      if (res.success) {
        toast.success(`Password reset for ${user.name}`);
        setPasswordDialogOpen(false);
        setNewPassword("");
      } else {
        toast.error(res.error || "Failed to reset password");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      {/* Change Role */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-xs"
        onClick={() => setRoleDialogOpen(true)}
        title="Assign Role"
      >
        <Shield className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
        Role
      </Button>

      {/* Reset Password */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-xs"
        onClick={() => setPasswordDialogOpen(true)}
        title="Reset Password"
      >
        <KeyRound className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
        Password
      </Button>

      {/* Toggle Status */}
      {!isSelf && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={handleStatusToggle}
          disabled={loading}
          title={user.status === "ACTIVE" ? "Deactivate User" : "Activate User"}
        >
          <Power
            className={`h-3.5 w-3.5 mr-1 ${
              user.status === "ACTIVE" ? "text-amber-500" : "text-emerald-500"
            }`}
          />
          {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
        </Button>
      )}

      {/* Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Select the system role for <strong>{user.name}</strong>. Permissions are tied to roles.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="role-select">System Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger id="role-select">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleRoleUpdate} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <form onSubmit={handlePasswordReset}>
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Set a new temporary password for <strong>{user.name}</strong> ({user.email}).
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2">
              <Label htmlFor="new-pw">New Password (min. 8 characters)</Label>
              <PasswordInput
                id="new-pw"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                disabled={loading}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPasswordDialogOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
