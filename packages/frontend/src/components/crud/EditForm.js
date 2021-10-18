import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import * as Yup from "yup";
import { Formik } from "formik";
import { useApp } from "../../AppProvider";
import * as formUtils from "../../utils/form";
import { EditFormFieldList } from "./EditFormFieldList";
import { CRUD_FORM_SUBMIT_TYPES } from "../../constants";
import { createRecord, updateRecord } from "../../services/crudService";
import useService from "../../hooks/useService";
import { EditFormPropagator } from "./EditFormPropagator";

const submitTypes = CRUD_FORM_SUBMIT_TYPES;

function EditForm({
  fields,
  setFields,
  data,
  valueCache,
  formRef,
  setValueCache,
  currentVersion,
  setCurrentVersion,
  setSubmitForm,
  submitFormSuccessCallback,
  submitFormMode,
  setFormIsDirty,
  setFormIsSubmitting,
  modelName,
}) {
  const { doToast } = useApp();

  const service = useService(true);
  const [schemaShape, setSchemaShape] = useState({});
  const validationSchema = Yup.object().shape(schemaShape);

  const handleSubmit = async (
    values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      const isNewRecord = values.id === "";
      const isPublishing = submitFormMode === submitTypes.PUBLISH;

      const verb = isPublishing ? "published" : "saved";
      const method = isNewRecord ? createRecord : updateRecord;

      // replace "" with null to prep data for sequelize
      let parsedValues = JSON.parse(
        JSON.stringify(values, function (key, value) {
          return value === "" ? null : value;
        })
      );

      const data = await service(
        [method, [modelName, parsedValues, isPublishing]],
        `Changes have been ${verb}.`
      );

      if (!data) {
        setStatus({ sent: false });
        setSubmitting(false);
        return;
      }

      if (isNewRecord) {
        resetForm({
          id: "",
          ...fields.reduce(
            (accumulator, current) => ({
              ...accumulator,
              [current.key]: "",
            }),
            {}
          ),
        });
      } else {
        resetForm({ values: data });
        setCurrentVersion(null);
      }
      setStatus({ sent: true });
      setSubmitting(false);
      submitFormSuccessCallback(data);
    } catch (error) {
      setStatus({ sent: false });
      setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!fields) return;
    setSchemaShape(formUtils.generateSchemaShape(fields));
  }, [fields]);

  useEffect(() => {
    formRef.current.resetForm({ values: data });
  }, [data, formRef]);

  useEffect(() => {
    setSubmitForm(() => () => {
      const form = formRef.current;
      if (!form.isValid) {
        const severity = "warning";
        const message = "Please correct form errors and try again.";

        form.validateForm().then((errors) => {
          form.setErrors(errors);
          form.handleSubmit();
        });
        doToast(severity, message);
      } else {
        form.handleSubmit();
      }
    });
  }, [setSubmitForm, formRef, doToast]);

  if (!fields) return "No fields have been defined.";

  return (
    <>
      <Formik
        initialValues={data}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        innerRef={formRef}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
          dirty,
          setFieldValue,
        }) => (
          <>
            <EditFormPropagator
              data={data}
              values={values}
              setValueCache={setValueCache}
              currentVersion={currentVersion}
              dirty={dirty}
              isSubmitting={isSubmitting}
              setFormIsDirty={setFormIsDirty}
              setFormIsSubmitting={setFormIsSubmitting}
            />
            <form onSubmit={handleSubmit}>
              <Grid container spacing={10}>
                <EditFormFieldList
                  fields={fields}
                  setFields={setFields}
                  setFieldValue={setFieldValue}
                  values={values}
                  valueCache={valueCache}
                  data={data}
                  currentVersion={currentVersion}
                  touched={touched}
                  errors={errors}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                />
              </Grid>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}

export default EditForm;
