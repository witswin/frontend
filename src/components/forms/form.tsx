"use client"

import { NullCallback } from "@/utils"
import { axiosInstance } from "@/utils/api/base"
import { Tab, Tabs } from "@nextui-org/react"
import { AxiosError, AxiosResponse } from "axios"
import {
  createContext,
  FC,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { Control, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import TextInput from "./text"
import NumberField from "./number"

export type FunctionalFormProps = {
  beforeSubmit?: (data: any) => any
  apiRoute: ApiRouteProps
  afterSubmit?: (res: any, response: AxiosResponse) => void
  validateStrategy?: "onBlur" | "onChange" | "onSubmit"
  fetchApi?: ApiRouteProps
  mapFetchedValues?: (data: any) => any
}

export const baseErrorMapper = (
  errors: any,
  setError: (name: string, value: any) => void,
) => {
  Object.keys(errors).forEach((key) => {
    setError(key, {
      type: "required",
      message: errors[key][0],
    })
  })
}

export const handleFetchError = (error: unknown) => {
  if (error instanceof AxiosError) {
    if (error.response) {
      toast.error(Object.values(error.response.data)[0] as string)
    }
  } else {
    toast.error("error on fetching the data")
  }
}

export type ApiRouteProps = {
  method: "POST" | "GET" | "PUT" | "PATCH"
  url: string
  headers?: Record<string, string>
  params?: Record<string, string>
}

export const useFunctionalForm = ({
  beforeSubmit,
  apiRoute,
  fetchApi,
  afterSubmit,
  mapFetchedValues,
  validateStrategy = "onBlur",
}: FunctionalFormProps) => {
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  const { formState, handleSubmit, reset, setError } = useForm({
    mode: validateStrategy,
    reValidateMode: validateStrategy,
    defaultValues: async () => {
      if (!fetchApi) {
        setReady(true)
        return {}
      }

      setLoading(true)

      let resultData: any = {}

      try {
        const res = await axiosInstance({
          method: apiRoute.method,
          url: apiRoute.url,
          headers: apiRoute.headers,
          params: apiRoute.params,
        })

        resultData = mapFetchedValues?.(res.data) ?? res.data
      } catch (e) {
        handleFetchError(e)
      } finally {
        setReady(true)
        setLoading(false)
      }
      return resultData
    },
  })

  const onSubmit = async (data: any) => {
    const mappedData = beforeSubmit?.(formState) ?? data
    setLoading(true)

    let resultData: any

    try {
      const res = await axiosInstance({
        method: apiRoute.method,
        url: apiRoute.url,
        headers: apiRoute.headers,
        data: mappedData,
        params: apiRoute.params,
      })
      resultData = res.data
      afterSubmit?.(resultData, res)
    } catch (e) {
      if (e instanceof AxiosError) {
        if (!e.response) {
          toast.error("Something happend with your internet connection")
          return
        }
        if (e.response.status === 422 || e.response.status === 400) {
          baseErrorMapper(e.response.data, setError)
        } else if (e.response.status === 401) {
          toast.error("Unauthorized")
        }
      } else {
        throw e
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    submit: handleSubmit(onSubmit),
    loading,
    reset,
    setError,
    isValid: formState.isValid,
    ready,
    formState,
  }
}

export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "address"
  | "date"
  | "datetime"
  | "time"
  | "image"
  | "file"
  | "checkbox"
  | "select"
  | "chain-currency"

export type FieldValidation = {
  type: "required" | "min" | "max" | "minLength" | "maxLength" | "pattern"
  message: string
  params?: any
  value?: any
}

export type Field = {
  className: string | undefined
  name: string
  type: FieldType
  label?: string
  palceholder?: string
  required?: boolean
  disabled?: boolean
  colSpan?: number
  options?: {
    label: string
    value: string
  }[]

  validations?: FieldValidation[]
}

export type ProgressTab = {
  title?: ReactNode
  fields: Field[]
  onNext?: () => void
  onBack?: () => void
}

export type FormBuilderProps = FunctionalFormProps & {
  baseGridSize?: number
  fields: Field[] | Record<string, ProgressTab>
  formTitle?: string
}

export const FormBuilderContext = createContext<{
  control?: Control<any, any>
  submit?: () => void
  loading?: boolean
  reset?: (data?: any) => void
  setError?: (name: string, value: any) => void
  isValid?: boolean
  fields: Field[] | Record<string, ProgressTab>
  baseGridSize: number
  formTitle?: string
  selectedTab?: string
  setSelectedTab: (value?: string) => void
  isTabValid?: (tabTitle: string) => boolean
}>({
  fields: [],
  baseGridSize: 12,
  formTitle: "",
  setSelectedTab: NullCallback,
})

export const useFormBuilderContext = () => useContext(FormBuilderContext)

export const FormBuilderProvider: FC<PropsWithChildren & FormBuilderProps> = ({
  children,
  apiRoute,
  fields,
  afterSubmit,
  beforeSubmit,
  formTitle,
  fetchApi,
  mapFetchedValues,
  validateStrategy,
  baseGridSize = 12,
}) => {
  const [tabIndex, setTabIndex] = useState<string | undefined>("")

  const { isValid, loading, reset, setError, submit, formState } =
    useFunctionalForm({
      apiRoute,
      afterSubmit,
      beforeSubmit,
      fetchApi,
      mapFetchedValues,
      validateStrategy,
    })

  return (
    <FormBuilderContext.Provider
      value={{
        fields,
        baseGridSize,
        formTitle,
        isValid,
        loading,
        reset,
        setError,
        submit,
        isTabValid: (tabTitle: string) =>
          !Array.isArray(fields) &&
          fields[tabTitle].fields.findIndex(
            (field) => formState.errors[field.name] !== undefined,
          ) !== -1,
        selectedTab: tabIndex,
        setSelectedTab: setTabIndex,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  )
}

export const FormTabRenderer: FC<{
  className?: string
  placement?: "top" | "bottom" | "start" | "end"
  isVertical?: boolean
}> = ({ className, placement, isVertical }) => {
  const { fields, selectedTab, setSelectedTab } = useFormBuilderContext()

  if (Array.isArray(fields)) return null

  return (
    <Tabs
      placement={placement}
      isVertical={isVertical}
      selectedKey={selectedTab}
      onSelectionChange={(e) => setSelectedTab(e as any)}
      className={className}
    >
      {Object.keys(fields).map((key, index) => (
        <Tab key={key} title={fields[key].title}>
          <RenderFields fields={fields[key].fields} />
        </Tab>
      ))}
    </Tabs>
  )
}

export const RenderFields: FC<{ fields: Field[] }> = ({ fields }) => {
  const { baseGridSize } = useFormBuilderContext()
  return (
    <div className={`grid grid-cols-${baseGridSize} gap-4 gap-y-8`}>
      {fields.map((field, index) => (
        <div key={index} className={`col-span-${field.colSpan ?? 1}`}>
          <FormField field={field} />
        </div>
      ))}
    </div>
  )
}

export const FormField: FC<{ field: Field }> = ({ field }) => {
  const { control } = useFormBuilderContext()

  if (!control) return null

  switch (field.type) {
    case "number":
      return (
        <NumberField
          control={control}
          label={field.label}
          rules={field.validations}
          name={field.name}
          className={field.className}
        />
      )
    // TODO: add more fields here
    default:
      return (
        <TextInput
          control={control}
          label={field.label}
          rules={field.validations}
          name={field.name}
          className={field.className}
        />
      )
  }
}

export const useFormValidations = ({
  rules,
}: {
  rules?: FieldValidation[]
}) => {
  return useMemo(() => {
    const obj: Record<string, any> = {}

    rules?.forEach((rule) => {
      obj[rule.type] = rule.value
    })

    return obj
  }, [rules])
}
