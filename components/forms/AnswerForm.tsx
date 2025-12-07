// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { MDXEditorMethods } from "@mdxeditor/editor";
// import { ReloadIcon } from "@radix-ui/react-icons";
// import dynamic from "next/dynamic";
// import Image from "next/image";
// import { useSession } from "next-auth/react";
// import { useRef, useState, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import { toast } from "@/hooks/use-toast";
// import { createAnswer } from "@/lib/actions/answer.action";
// import { api } from "@/lib/api";
// import { AnswerSchema } from "@/lib/validations";

// const Editor = dynamic(() => import("@/components/editor"), {
//   ssr: false,
// });

// interface Props {
//   questionId: string;
//   questionTitle: string;
//   questionContent: string;
// }

// const AnswerForm = ({ questionId, questionTitle, questionContent }: Props) => {
//   const [isAnswering, startAnsweringTransition] = useTransition();
//   const [isAISubmitting, setIsAISubmitting] = useState(false);
//   const session = useSession();

//   const editorRef = useRef<MDXEditorMethods>(null);

//   const form = useForm<z.infer<typeof AnswerSchema>>({
//     resolver: zodResolver(AnswerSchema),
//     defaultValues: {
//       content: "",
//     },
//   });

//   const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
//     startAnsweringTransition(async () => {
//       const result = await createAnswer({
//         questionId,
//         content: values.content,
//       });

//       if (result.success) {
//         form.reset();

//         toast({
//           title: "Success",
//           description: "Your answer has been posted successfully",
//         });

//         if (editorRef.current) {
//           editorRef.current.setMarkdown("");
//         }
//       } else {
//         toast({
//           title: "Error",
//           description: result.error?.message,
//           variant: "destructive",
//         });
//       }
//     });
//   };

//   const generateAIAnswer = async () => {
//     if (session.status !== "authenticated") {
//       return toast({
//         title: "Please log in",
//         description: "You need to be logged in to use this feature",
//       });
//     }

//     setIsAISubmitting(true);

//     const userAnswer = editorRef.current?.getMarkdown();

//     try {
//       const { success, data, error } = await api.ai.getAnswer(
//         questionTitle,
//         questionContent,
//         userAnswer
//       );

//       if (!success) {
//         return toast({
//           title: "Error",
//           description: error?.message,
//           variant: "destructive",
//         });
//       }

//       const formattedAnswer = data.replace(/<br>/g, " ").toString().trim();

//       if (editorRef.current) {
//         editorRef.current.setMarkdown(formattedAnswer);

//         form.setValue("content", formattedAnswer);
//         form.trigger("content");
//       }

//       toast({
//         title: "Success",
//         description: "AI generated answer has been generated",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description:
//           error instanceof Error
//             ? error.message
//             : "There was a problem with your request",
//         variant: "destructive",
//       });
//     } finally {
//       setIsAISubmitting(false);
//     }
//   };

//   return (
//     <div>
//       <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
//         <h4 className="paragraph-semibold text-dark400_light800">
//           Write your answer here
//         </h4>
//         <Button
//           className="btn light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
//           disabled={isAISubmitting}
//           onClick={generateAIAnswer}
//         >
//           {isAISubmitting ? (
//             <>
//               <ReloadIcon className="mr-2 size-4 animate-spin" />
//               Generating...
//             </>
//           ) : (
//             <>
//               <Image
//                 src="/icons/stars.svg"
//                 alt="Generate AI Answer"
//                 width={12}
//                 height={12}
//                 className="object-contain"
//               />
//               Generate AI Answer
//             </>
//           )}
//         </Button>
//       </div>
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(handleSubmit)}
//           className="mt-6 flex w-full flex-col gap-10"
//         >
//           <FormField
//             control={form.control}
//             name="content"
//             render={({ field }) => (
//               <FormItem className="flex w-full flex-col gap-3">
//                 <FormControl className="mt-3.5">
//                   <Editor
//                     value={field.value}
//                     editorRef={editorRef}
//                     fieldChange={field.onChange}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <div className="flex justify-end">
//             <Button type="submit" className="primary-gradient w-fit">
//               {isAnswering ? (
//                 <>
//                   <ReloadIcon className="mr-2 size-4 animate-spin" />
//                   Posting...
//                 </>
//               ) : (
//                 "Post Answer"
//               )}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default AnswerForm;

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { ReloadIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { createAnswer } from "@/lib/actions/answer.action";
import { api } from "@/lib/api";
import { AnswerSchema } from "@/lib/validations";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

interface Props {
  questionId: string;
  questionTitle: string;
  questionContent: string;
}

const AnswerForm = ({ questionId, questionTitle, questionContent }: Props) => {
  const [isAnswering, startAnsweringTransition] = useTransition();
  const [isAISubmitting, setIsAISubmitting] = useState(false);
  const session = useSession();

  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    startAnsweringTransition(async () => {
      const result = await createAnswer({
        questionId,
        content: values.content,
      });

      if (result.success) {
        form.reset();

        toast({
          title: "Success",
          description: "Your answer has been posted successfully",
        });

        if (editorRef.current) {
          editorRef.current.setMarkdown("");
        }
      } else {
        toast({
          title: "Error",
          description: result.error?.message,
          variant: "destructive",
        });
      }
    });
  };

  // In components/forms/AnswerForm.tsx

  // ... imports

  const sanitizeMarkdown = (raw: string) => {
    let formatted = raw
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/\r\n/g, "\n")
      .trim();

    // FIX 1: Robust Regex for empty code blocks
    // Matches ``` at the start of a line, followed by optional whitespace,
    // and ending immediately at the newline.
    // The 'm' flag is critical here.
    formatted = formatted.replace(/^(\s*)```[\s]*$/gm, "$1```plaintext");
    // FIX 2: Also catch ``` followed by nothing (end of string)
    if (formatted.endsWith("```")) {
      formatted = formatted.slice(0, -3) + "```plaintext";
    }

    // Close unbalanced fences
    const openFences = (formatted.match(/^```/gm) || []).length;
    if (openFences % 2 !== 0) {
      formatted += "\n```";
    }

    return formatted;
  };

  const generateAIAnswer = async () => {
    if (session.status !== "authenticated") {
      return toast({
        title: "Please log in",
        description: "You need to be logged in to use this feature",
      });
    }

    setIsAISubmitting(true);
    const userAnswer = editorRef.current?.getMarkdown();

    try {
      const { success, data, error } = await api.ai.getAnswer(
        questionTitle,
        questionContent,
        userAnswer
      );

      if (!success) {
        return toast({
          title: "Error",
          description: error?.message,
          variant: "destructive",
        });
      }

      const formattedAnswer = sanitizeMarkdown(data.toString());

      if (editorRef.current) {
        try {
          // Try setting the markdown normally
          editorRef.current.setMarkdown(formattedAnswer);
          form.setValue("content", formattedAnswer);
          form.trigger("content");
        } catch (editorError) {
          // FIX 3: Safe Fallback
          // If the editor crashes, strip all code blocks to ensure it renders as plain text.
          console.error("Editor crash prevented:", editorError);

          const safeText =
            "**AI Answer (Raw):**\n\n" + formattedAnswer.replace(/```/g, "'''"); // Replace backticks with quotes

          editorRef.current.setMarkdown(safeText);
          form.setValue("content", safeText);
        }
      }

      toast({
        title: "Success",
        description: "AI generated answer has been inserted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Request failed",
        variant: "destructive",
      });
    } finally {
      setIsAISubmitting(false);
    }
  };

  // ... return statement

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="btn light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
          disabled={isAISubmitting}
          onClick={generateAIAnswer}
        >
          {isAISubmitting ? (
            <>
              <ReloadIcon className="mr-2 size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Image
                src="/icons/stars.svg"
                alt="Generate AI Answer"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    value={field.value}
                    editorRef={editorRef}
                    fieldChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" className="primary-gradient w-fit">
              {isAnswering ? (
                <>
                  <ReloadIcon className="mr-2 size-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Answer"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
