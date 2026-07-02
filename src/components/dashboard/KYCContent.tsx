
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function KYCContent() {
    const [kycStatus, setKycStatus] = useState<'pending' | 'verified' | 'unverified'>('unverified');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setKycStatus('pending');
            setIsSubmitting(false);
            toast.success('KYC Documents submitted successfully!');
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">KYC Verification</h2>
                    <p className="text-muted-foreground">Submit your documents to verify your farmer identity.</p>
                </div>
                <div>
                    {kycStatus === 'verified' && (
                        <Badge className="bg-green-500 hover:bg-green-600 px-3 py-1 text-sm gap-1">
                            <CheckCircle className="h-3.5 w-3.5" /> Verified
                        </Badge>
                    )}
                    {kycStatus === 'pending' && (
                        <Badge variant="secondary" className="px-3 py-1 text-sm gap-1">
                            <Clock className="h-3.5 w-3.5" /> Verification Pending
                        </Badge>
                    )}
                    {kycStatus === 'unverified' && (
                        <Badge variant="destructive" className="px-3 py-1 text-sm">
                            Unverified
                        </Badge>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Identity Proof</CardTitle>
                        <CardDescription>Upload Aadhar Card or Voter ID</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="id-proof">Document</Label>
                            <Input id="id-proof" type="file" disabled={kycStatus !== 'unverified'} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Land Record</CardTitle>
                        <CardDescription>Upload RTC / Pahani / Land Document</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="land-proof">Document</Label>
                            <Input id="land-proof" type="file" disabled={kycStatus !== 'unverified'} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {kycStatus === 'unverified' && (
                <div className="flex justify-end">
                    <Button onClick={handleUpload} disabled={isSubmitting} className="w-full sm:w-auto">
                        {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                        <Upload className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )}

            {kycStatus === 'pending' && (
                <Card className="bg-muted/50 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg">Verification in Progress</h3>
                        <p className="text-muted-foreground max-w-md mt-2">
                            Our team is reviewing your documents. This usually takes 24-48 hours. You will be notified once verified.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
