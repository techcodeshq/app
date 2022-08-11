import {
  Image,
  Heading,
  Text,
  HStack,
  Box,
  FormControl,
  Input,
  Button,
  FormErrorMessage,
  Radio,
  RadioGroup,
  FormLabel,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { useMutation } from "@hooks/useMutation";
import { useRouter } from "next/router";
import {
  ClubDays,
  ClubMemberInfo,
  ClubMemberStatus,
  ClubSGOSticker,
} from "@prisma/client";

// TODO: better error messages
const validateRegisterInfo = z.object({
  osis: z
    .string({ required_error: "Osis is required" })
    .length(9, "Osis must be 9 letters long")
    .refine((osis) => !isNaN(+osis), "Osis must contain only numbers"),
  prefect: z.string().nullish(),
  email: z.string().email(),
  doeEmail: z.string().email().nullish(),
  nycEmail: z.string().email().nullish(),
  class: z.enum(["2026", "2025", "2024", "2023"]),
  sgoSticker: z.nativeEnum(ClubSGOSticker),
  status: z.nativeEnum(ClubMemberStatus),
  days: z.nativeEnum(ClubDays),
  comfortability: z.number().min(1).max(5),
});

export const Register: React.FC = () => {
  const { data: session, status } = useSession();
  const register = useMutation<null, Omit<ClubMemberInfo, "userId">>(
    "/users/club-member-info",
    "post",
  );
  const router = useRouter();

  return (
    <Formik
      initialValues={{
        osis: null,
        prefect: null,
        email: null,
        bthsEmail: null,
        nycEmail: null,
        class: null,
        sgoSticker: null,
        status: null,
        days: null,
        comfortability: null,
      }}
      validationSchema={toFormikValidationSchema(validateRegisterInfo)}
      onSubmit={async (values, { setSubmitting }) => {
        console.log("Hello world");
        setSubmitting(true);
        await register(values);
        setSubmitting(false);

        const urlParams = new URLSearchParams(window.location.search);
        router.push(urlParams.get("url"));
      }}
    >
      {({ isSubmitting, setFieldValue, errors, submitForm }) => (
        <Form>
          <HStack my="4">
            <Image src="/logo.svg" alt="TechCodes Logo" />
            <Box pl="4">
              <Heading>Welcome to TechCodes, {session?.user.name}!</Heading>
              <Text>Let&apos;s finish setting up your account</Text>
            </Box>
          </HStack>

          <Field name="osis">
            {({ field }) => (
              <FormControl isRequired isInvalid={!!errors.osis} mb="4">
                <Input
                  {...field}
                  type="text"
                  variant="filled"
                  placeholder="OSIS Number"
                />
                <FormErrorMessage>{errors.osis}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name="prefect">
            {({ field }) => (
              <FormControl isInvalid={!!errors.prefect} mb="4">
                <Input
                  {...field}
                  type="text"
                  variant="filled"
                  placeholder="Prefect (Leave blank if you don't know)"
                />
                <FormErrorMessage>{errors.prefect}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name="email">
            {({ field }) => (
              <FormControl isRequired isInvalid={!!errors.email} mb="4">
                <Input
                  {...field}
                  type="email"
                  variant="filled"
                  placeholder="Email"
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name="bthsEmail">
            {({ field }) => (
              <FormControl isInvalid={!!errors.bthsEmail} mb="4">
                <Input
                  {...field}
                  type="email"
                  variant="filled"
                  placeholder="BTHS Email (Optional)"
                />
                <FormErrorMessage>{errors.bthsEmail}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name="nycEmail">
            {({ field }) => (
              <FormControl isInvalid={!!errors.nycEmail} mb="4">
                <Input
                  {...field}
                  type="email"
                  variant="filled"
                  placeholder="NYC Students Email (Optional)"
                />
                <FormErrorMessage>{errors.nycEmail}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <FormControl isRequired isInvalid={!!errors.class} mb="4">
            <FormLabel>Class</FormLabel>
            <RadioGroup onChange={(v) => setFieldValue("class", v)}>
              <HStack spacing="24px">
                <Radio value="2023">2023</Radio>
                <Radio value="2024">2024</Radio>
                <Radio value="2025">2025</Radio>
                <Radio value="2026">2026</Radio>
              </HStack>
            </RadioGroup>
            <FormErrorMessage>{errors.class}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.sgoSticker} mb="4">
            <FormLabel>Do you have an SGO Sticker?</FormLabel>
            <RadioGroup onChange={(v) => setFieldValue("sgoSticker", v)}>
              <HStack spacing="24px">
                <Radio value={ClubSGOSticker.Yes}>Yes</Radio>
                <Radio value={ClubSGOSticker.NoPlanningToBuy}>
                  No, but I&apos;m planning to buy one this year.
                </Radio>
                <Radio value={ClubSGOSticker.NoNotPlanningToBuy}>
                  Yes, but I&apos;m not planning to buy one this year.
                </Radio>
              </HStack>
            </RadioGroup>
            <FormErrorMessage>{errors.sgoSticker}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.status} mb="4">
            <FormLabel>Are you a new or returning member?</FormLabel>
            <RadioGroup onChange={(v) => setFieldValue("status", v)}>
              <HStack spacing="24px">
                <Radio value={ClubMemberStatus.New}>New</Radio>
                <Radio value={ClubMemberStatus.Returning}>Returning</Radio>
              </HStack>
            </RadioGroup>
            <FormErrorMessage>{errors.status}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.days} mb="4">
            <FormLabel>Days</FormLabel>
            <RadioGroup onChange={(v) => setFieldValue("days", v)}>
              <HStack spacing="24px">
                <Radio value={ClubDays.Python}>Thursday (Python)</Radio>
                <Radio value={ClubDays.WebDev}>Friday (Web Dev)</Radio>
                <Radio value={ClubDays.Both}>Both</Radio>
              </HStack>
            </RadioGroup>
            <FormErrorMessage>{errors.days}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.comfortability} mb="4">
            <FormLabel>
              How comfortable are you with the topics you chose?
            </FormLabel>
            <RadioGroup
              onChange={(v) => setFieldValue("comfortability", parseInt(v))}
            >
              <HStack spacing="24px">
                <Radio value="1">1</Radio>
                <Radio value="2">2</Radio>
                <Radio value="3">3</Radio>
                <Radio value="4">4</Radio>
                <Radio value="5">5</Radio>
              </HStack>
            </RadioGroup>
            <FormErrorMessage>{errors.comfortability}</FormErrorMessage>
          </FormControl>

          <Button
            isLoading={isSubmitting}
            type="submit"
            onClick={() => submitForm()}
          >
            Get Started!
          </Button>
        </Form>
      )}
    </Formik>
  );
};
