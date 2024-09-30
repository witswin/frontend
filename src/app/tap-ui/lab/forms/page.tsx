"use client"

import { FormBuilderProvider, FormTabRenderer } from "@/components/forms/form"
import { Button } from "@nextui-org/react"

export default function LabForms() {
  return (
    <div className="p-10">
      <FormBuilderProvider
        apiRoute={{
          method: "POST",
          url: "/auth/login",
        }}
        fields={{
          main: {
            fields: [
              {
                name: "username",
                type: "text",
                label: "Username",
                validations: [
                  {
                    type: "required",
                    message: "Username is required",
                    value: true,
                  },
                ],
              },
              {
                name: "password",
                type: "password",
                label: "Password",
                validations: [
                  {
                    type: "required",
                    message: "Password is required",
                    value: true,
                  },
                ],
              },
            ],
            title: "Main content",
          },
          info: {
            fields: [
              {
                name: "image",
                type: "image",
                label: "Image",
                validations: [
                  {
                    type: "required",
                    message: "Image is required",
                    value: true,
                  },
                ],
              },
              {
                name: "multi",
                type: "array-object",
                label: "Multiple Field",
                fields: [
                  {
                    name: "firstName",
                    type: "text",
                    label: "First Name",
                  },
                  {
                    name: "lastName",
                    type: "text",
                    label: "Last Name",
                  },
                  {
                    name: "username",
                    type: "text",
                    label: "Username",
                    validations: [
                      {
                        type: "required",
                        message: "Username is required",
                        value: true,
                      },
                    ],
                  },
                  {
                    name: "password",
                    type: "password",
                    label: "Password",
                    validations: [
                      {
                        type: "required",
                        message: "Password is required",
                        value: true,
                      },
                    ],
                  },
                ],
              },
            ],
            title: "Extra info",
          },
        }}
      >
        <FormTabRenderer></FormTabRenderer>
        <div className="mt-10 text-right">
          <Button color="primary" type="submit">
            Submit
          </Button>
        </div>
      </FormBuilderProvider>
    </div>
  )
}
