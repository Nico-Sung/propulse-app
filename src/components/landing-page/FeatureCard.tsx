import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <Card>
            <CardHeader className="items-center">
                {icon}
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
                <p>{description}</p>
            </CardContent>
        </Card>
    );
}
