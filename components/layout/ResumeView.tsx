"use client"; // <-- Add this line to mark this as a Client Component

import { Button } from "@/components/ui/button";
import { Mails, Share2Icon, DownloadIcon } from "lucide-react";
import { FormProvider, useFormContext } from "@/lib/context/FormProvider";
import { usePathname } from "next/navigation"; // This requires the component to be a Client Component
import PageWrapper from "@/components/common/PageWrapper";
import Header from "@/components/layout/Header";
import React, { useState, useEffect } from "react";
import ResumePreview from "@/components/layout/my-resume/ResumePreview";
import { RWebShare } from "react-web-share"; // Import RWebShare correctly

const FinalResumeView = ({
  params,
  isOwnerView,
}: {
  params: { id: string };
  isOwnerView: boolean;
}) => {
  const { formData, setFormData } = useFormContext();
  const [post, setPost] = useState(formData?.post || "");
  const [companyName, setCompanyName] = useState(formData?.companyName || "");
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null); // Add state for generated letter

  useEffect(() => {
    if (setFormData) {
      setFormData({ ...formData, post, companyName });
    }
  }, [post, companyName, formData, setFormData]);

  const handleDownload = () => {
    window.print();
  };

  const handleMotivationLetterClick = async () => {
    // Get post and companyName from the form data
    const post = formData?.post;
    const companyName = formData?.companyName;

    // Generate the motivation letter (this could be handled with an API call or another method)
    const generated = `Dear Sir/Madam, I am applying for the position of ${post} at ${companyName}. I am excited to contribute my skills.`;

    setGeneratedLetter(generated); // Set the generated letter content

    // Directly pass to the Streamlit URL with the parameters
    const streamlitUrl = `http://localhost:8501/?post=${encodeURIComponent(
      post
    )}&companyName=${encodeURIComponent(companyName)}`;

    window.open(streamlitUrl, "_blank"); // Open Streamlit in a new tab
  };

  const path = usePathname();

  return (
    <PageWrapper>
      <FormProvider params={params}>
        <div id="no-print">
          <Header />
          <div className="my-10 mx-10 md:mx-20 lg:mx-36">
            {isOwnerView ? (
              <>
                <h2 className="text-center text-2xl font-bold">
                  Congrats! Your ultimate AI-generated resume is ready!
                </h2>
                <p className="text-center text-gray-600">
                  You can now download your resume or generate a motivation
                  letter.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-center text-2xl font-bold">
                  Resume Preview
                </h2>
                <p className="text-center text-gray-600">
                  You are currently viewing a preview of someone else's resume.
                </p>
              </>
            )}
            <div className="flex max-sm:flex-col justify-center gap-8 my-10">
              <Button
                className="flex px-12 py-6 gap-2 rounded-full bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-700/30 text-white"
                onClick={handleDownload}
              >
                <DownloadIcon className="size-6" /> Download
              </Button>
              <Button
                className="flex px-12 py-6 gap-2 rounded-full bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-700/30 text-white"
                onClick={handleMotivationLetterClick}
              >
                <Mails className="size-6" /> Generate Motivation Letter
              </Button>

              <RWebShare
                data={{
                  text: "Hello everyone, check out my resume by clicking the link!",
                  url: `${process.env.BASE_URL}/${path}`,
                  title: `${formData?.firstName} ${formData?.lastName}'s Resume`,
                }}
                onClick={() => console.log("Shared successfully!")}
              >
                <Button className="flex px-12 py-6 gap-2 rounded-full bg-slate-200 hover:bg-primary-700/20 focus:ring-4 focus:ring-primary-700/30 text-black">
                  <Share2Icon className="size-6" /> Share URL
                </Button>
              </RWebShare>
            </div>
          </div>
        </div>
        <div className="px-10 pt-4 pb-16 max-sm:px-5 max-sm:pb-8 print:p-0">
          <div id="print-area">
            <ResumePreview />
          </div>
        </div>
      </FormProvider>
    </PageWrapper>
  );
};


export default FinalResumeView;
