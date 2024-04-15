import React, { useState, FC, useEffect } from "react";
import { ThemedForm } from "@/pages";
import validator from "@rjsf/validator-ajv8";
import { toast } from "react-toastify";
import { Settings, User } from "@prisma/client";
import { useSession } from "next-auth/react";


interface AddSettingFormProps {
  onSubmit: (formData: Partial<Settings>) => Promise<void>;
}
const AddSettingForm: FC<AddSettingFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Settings>>({
    name: "",
    value: "",
    fieldType: "String"
  });

  const { data: session, status } = useSession();

  const formSchema = {
    type: "object",
    properties: {
      name: {
        type: "string",
        title: "Name",
      },
      value: {
        type: "string",
        title: "Value",
      },
      fieldType: {
        type: "string",
        title: "Field Type",
        oneOf: [
              {
                const: "String",
                title: "String",
              },
              {
                const: "Number",
                title: "Number",
              },
            ],
        default: "String",
      },
    },
    required: ["name", "value", "fieldType"],
  };
  const uiSchema = {
    name: {
      "ui:placeholder": "Name",
      "ui:widget": "InputWidget",
    },
    value: {
      "ui:placeholder": "Value",
      "ui:widget": "InputWidget",
    },
    fieldType: {
      "ui:placeholder": "Field Type",
      "ui:widget": "SelectWidget",
    },
  };

  const handleSubmit = async ({ formData }: { formData: any }) => {
    try {
      await onSubmit(formData);
      setFormData({
        name: "",
        value: "",
        fieldType: "String",
      });
    } catch (error) {
      console.error(error);
      toast("Error adding setting", { type: "error" });
    }
  };

  return (
    <div className="flex">
      <ThemedForm
        schema={formSchema}
        uiSchema={uiSchema}
        onSubmit={handleSubmit as any}
        formData={formData}
        showErrorList={false}
        validator={validator}
        className="p-4"
      >
        <div>
          <button
            className="bg-black text-white px-4 py-2 rounded cursor-pointer hover:bg-white mt-4 border-2 border-black hover:text-black"
            type="submit"
          >
            Add Setting
          </button>
        </div>
      </ThemedForm>
    </div>
  );
};

export default AddSettingForm;
