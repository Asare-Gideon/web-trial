import { FIREBASE_STORAGE } from "@/firebase/config";
import { Editor } from "@tinymce/tinymce-react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import React, { useRef, useState } from "react";

interface EditorComProps {
  editorState: string;
  setEditorState: (content: string) => void;
  height?: number;
}

const EditorCom: React.FC<EditorComProps> = ({
  editorState,
  setEditorState,
  height,
}) => {
  const editorRef = useRef<any>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0); // State to track progress

  // Handle image upload to Firebase Storage with progress tracking
  const handleImageUpload = (
    blobInfo: any[],
    success: (url: string) => void,
    failure: (error: string) => void,
    progress?: (percent: number) => void
  ) => {
    const file = blobInfo[0].blob(); // Get the first file blob from TinyMCE
    const storageRef = ref(
      FIREBASE_STORAGE,
      "blog_images/" + new Date().getTime() + Math.round(Math.random() * 999)
    ); // Custom image path

    const uploadTask = uploadBytesResumable(storageRef, file); // Use uploadBytesResumable for progress tracking

    // Monitor the progress of the upload
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percentUploaded =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(percentUploaded); // Update the progress bar

        if (progress) {
          progress(percentUploaded); // Update TinyMCE's internal progress function
        }
      },
      (error) => {
        console.error("Image upload failed:", error);
        failure("Image upload failed.");
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          success(downloadURL); // Insert image URL into editor
        } catch (error) {
          console.error("Failed to retrieve image URL:", error);
          failure("Image URL retrieval failed.");
        }
        setUploadProgress(0); // Reset progress bar after upload
      }
    );
  };

  return (
    <>
      <Editor
        apiKey="3p5qron9q9nm7zsrlv3byp00d6s97u03cxqrrg4or7xdkqjd" // Your TinyMCE API key
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={editorState}
        init={{
          height: height ? height : 500,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic backcolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
          file_picker_callback: (callback, value, meta) => {
            if (meta.filetype === "image") {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");

              input.onchange = async function () {
                const file = (input.files as FileList)[0];
                const storageRef = ref(
                  FIREBASE_STORAGE,
                  "blog_images/" +
                    new Date().getTime() +
                    Math.round(Math.random() * 999)
                );

                const uploadTask = uploadBytesResumable(storageRef, file); // Use uploadBytesResumable for progress tracking

                uploadTask.on(
                  "state_changed",
                  (snapshot) => {
                    const percentUploaded =
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(percentUploaded); // Update the progress bar

                    if (percentUploaded === 100) {
                      setTimeout(() => {
                        setUploadProgress(0); // Reset progress bar after upload
                      }, 500); // Reset after a short delay
                    }
                  },
                  (error) => {
                    console.error("Image upload failed:", error);
                  },
                  async () => {
                    try {
                      const downloadURL = await getDownloadURL(
                        uploadTask.snapshot.ref
                      );
                      callback(downloadURL, { alt: file.name }); // Insert image URL into editor
                    } catch (error) {
                      console.error("Image upload failed:", error);
                    }
                  }
                );
              };

              input.click(); // Trigger file picker
            }
          },
          images_upload_handler: handleImageUpload, // Custom handler for image uploads
          automatic_uploads: true,
          image_advtab: true, // Enables image editing in TinyMCE
          file_picker_types: "image media", // Allow media and image file picker
          media_live_embeds: true, // Allow live media embedding
          media_dimensions: true, // Show media dimensions option
          media_url_resolver: (data: any, resolve: any) => {
            if (data.url.includes("youtu") || data.url.includes("vimeo")) {
              resolve({
                html: `<iframe width="560" height="315" src="${data.url}" frameborder="0" allowfullscreen></iframe>`,
              });
            } else {
              resolve({ html: "" });
            }
          },
          // Enable drag-and-drop functionality
          images_upload_url: "/postAcceptor.php", // Placeholder URL
          images_reuse_filename: true, // Reuse the original filename
          paste_data_images: true, // Allow pasting images from clipboard
        }}
        onEditorChange={(newContent) => setEditorState(newContent)} // Update the editor state
      />

      {/* Tailwind CSS Progress Bar */}
      {uploadProgress > 0 && (
        <div className=" absolute bottom-0 right-0 left-0 top-0 flex justify-center items-center z-[9999]">
          <div className="w-[320px] h-[100px]">
            <div className="w-full bg-gray-200  rounded-full mt-4">
              <div
                className="bg-primary text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                style={{ width: `${uploadProgress}%` }}
              >
                {Math.round(uploadProgress)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditorCom;
