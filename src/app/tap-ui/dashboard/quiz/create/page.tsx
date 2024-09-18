import {
  FormBuilderProvider,
  FormTabRenderer,
  ProgressTab,
} from "@/components/forms/form"
import EditableTable from "./table"
import { FaPhotoVideo, FaQuestion, FaUser } from "react-icons/fa"

const tabs: Record<string, ProgressTab> = {
  providerInfo: {
    title: (
      <span className="flex items-center gap-3">
        <FaUser />
        <span>Personal Info</span>
      </span>
    ),
    fields: [
      {
        name: "name",
        type: "text",
        label: "Provider Name",
        required: true,
      },
      {
        name: "email",
        type: "text",
        label: "Email",
        required: true,
      },
      {
        name: "twitter",
        type: "text",
        label: "Twitter Username",
        required: true,
      },
      {
        name: "description",
        type: "textarea",
        label: "Description",
      },
    ],
  },

  media: {
    fields: [
      {
        name: "image",
        type: "image",
        label: "Image",
        required: true,
      },
    ],
    title: (
      <span className="flex items-center gap-3">
        <FaPhotoVideo />
        <span>Media</span>
      </span>
    ),
  },

  questions: {
    fields: [
      {
        name: "questions",
        type: "array-object",
        label: "Questions",
        fields: [
          {
            name: "question",
            type: "text",
            label: "Question",
            required: true,
          },
          {
            name: "choices",
            type: "array-table",
            label: "Choices",
            fields: [
              {
                name: "choice",
                type: "text",
                label: "Choice",
                required: true,
              },
              {
                name: "correct",
                type: "checkbox",
                label: "Is Correct",
                required: true,
              },
            ],
          },
        ],
      },
    ],
    title: (
      <span className="flex items-center gap-3">
        <FaQuestion />
        <span>Questions</span>
      </span>
    ),
  },
}

const CreateQuiz = () => {
  return (
    <div className="mt-10">
      <h3>Create a Quiz</h3>
      <div className="mt-5 p-2">
        <FormBuilderProvider
          apiRoute={{
            method: "POST",
            url: "/quiz/create",
          }}
          fields={tabs}
          formTitle="Create Quiz"
        >
          <FormTabRenderer color="primary" variant="bordered"></FormTabRenderer>
        </FormBuilderProvider>
      </div>

      <div className="mt-30"></div>
    </div>
  )
}

export default CreateQuiz
