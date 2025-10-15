"use client";

import AuthHeader from "@/components/auth/AuthHeader";
import AuthForm from "@/components/auth/AuthForm";
import AuthFooter from "@/components/auth/AuthFooter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
                <AuthHeader />
                <CardContent>
                    <AuthForm />
                </CardContent>
                <CardFooter className="flex flex-col gap-2 items-center">
                    <AuthFooter />
                </CardFooter>
            </Card>
        </div>
    );
}
