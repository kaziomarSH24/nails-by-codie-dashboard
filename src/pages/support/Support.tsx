import { Mail, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";

const Support = () => {
    return (
        <div className=" max-w-6xl  mx-auto px-5 py-16 mt-10  ">
            {/* Heading */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold">We're here to help</h1>
                <p className="mt-2 text-gray-500">
                    Have a question or need assistance? Send us a message and we'll get back to you as soon as possible.
                </p>
            </div>

            {/* Main content */}
            <div className=" flex lg:flex-row flex-col  mt-12 gap-x-12  ">
                {/* Left side - Info cards */}
                <div className="flex flex-col space-y-6  w-full   ">
                    <Card className="flex items-center space-x-4 p-4 shadow">
                        <div className="bg-gray-100 p-3 rounded-lg">
                            <Mail className="w-6 h-6 text-gray-700" />
                        </div>
                        <CardContent className="p-0">
                            <CardTitle>Email Us</CardTitle>
                            <CardDescription className="text-sm text-gray-500">
                                We typically respond within 24 hours
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="flex items-center space-x-4 p-4 shadow">
                        <div className="bg-gray-100 p-3 rounded-lg">
                            <Clock className="w-6 h-6 text-gray-700" />
                        </div>
                        <CardContent className="p-0">
                            <CardTitle>Support Hours</CardTitle>
                            <CardDescription className="text-sm text-gray-500">
                                Our team is available to assist you
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>

                {/* Right side - Contact form */}
                <div className=" w-full ">
                    <Card className="p-6 shadow">
                        <CardHeader className="pb-4">
                            <CardTitle>Send us a message</CardTitle>
                            <CardDescription className="text-sm text-gray-500">
                                Fill out the form below and we'll respond to your inquiry shortly
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input placeholder="Your name" />
                                <Input type="email" placeholder="your.email@example.com" />
                            </div>

                            <Input placeholder="What is this regarding?" />

                            <Textarea placeholder="Tell us more about your question or issue..." className="resize-none" />

                            <Button className="w-full py-3 rounded-lg text-white font-bold bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] mt-14">
                                <span>Send Message</span>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Support;