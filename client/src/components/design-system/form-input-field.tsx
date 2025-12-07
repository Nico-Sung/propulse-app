"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type SelectOption = {
    value: string;
    label: string;
};

type BaseProps = {
    id: string;
    label: string;
    as?: "input" | "textarea" | "select";
    className?: string;
    inputClassName?: string;
    options?: SelectOption[];
};

type Props = BaseProps &
    React.ComponentPropsWithoutRef<"input"> &
    React.ComponentPropsWithoutRef<"textarea"> &
    React.ComponentPropsWithoutRef<"select">;

export default function FormInputField(props: Props) {
    const {
        id,
        label,
        as = "input",
        className = "space-y-2",
        inputClassName,
        options,
        ...rest
    } = props;

    const inputCommonClass =
        inputClassName ||
        "w-full rounded-md border bg-transparent px-3 py-2 text-sm";

    return (
        <div className={className}>
            <Label htmlFor={id}>{label}</Label>
            {as === "input" && (
                <Input
                    id={id}
                    {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
                />
            )}

            {as === "textarea" && (
                <textarea
                    id={id}
                    className={inputCommonClass}
                    {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                />
            )}

            {as === "select" && (
                <select
                    id={id}
                    className={inputCommonClass}
                    {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
                >
                    {(options || []).map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
}
