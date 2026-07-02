
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { MessageSquare, Send } from 'lucide-react';

export function SupportContent() {
    const [ticketType, setTicketType] = useState('complaint');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        orderId: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success('Ticket submitted successfully! We will contact you shortly.');
            setFormData({ subject: '', message: '', orderId: '' });
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Support & Complaints</h2>
                <p className="text-muted-foreground">Submit a complaint or request help.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Submit a Ticket</CardTitle>
                        <CardDescription>We usually respond within 24 hours.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select value={ticketType} onValueChange={setTicketType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="complaint">Complaint</SelectItem>
                                        <SelectItem value="support">Technical Support</SelectItem>
                                        <SelectItem value="feedback">Feedback</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    name="subject"
                                    placeholder="Brief summary of the issue"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {ticketType === 'complaint' && (
                                <div className="space-y-2">
                                    <Label htmlFor="orderId">Order ID (Optional)</Label>
                                    <Input
                                        id="orderId"
                                        name="orderId"
                                        placeholder="e.g. ORD-12345"
                                        value={formData.orderId}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    placeholder="Describe your issue in detail..."
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Sending...' : 'Submit Ticket'}
                                <Send className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle>Common Issues</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-lg border bg-card p-4 space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-primary" />
                                Payment Issues
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Payments are processed every Friday. If you haven't received yours, check your bank details in Profile.
                            </p>
                        </div>

                        <div className="rounded-lg border bg-card p-4 space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-primary" />
                                Product Verification
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                New products verify take up to 4 hours. Status will update automatically.
                            </p>
                        </div>

                        <div className="rounded-lg border bg-card p-4 space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-primary" />
                                Delivery Disputes
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                For disputes regarding product quality or delivery, please provide the Order ID when contacting us.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
