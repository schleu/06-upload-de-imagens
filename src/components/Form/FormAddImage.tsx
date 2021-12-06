/* eslint-disable no-console */
import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  // validate: {
  //
  //   acceptedFormats: {
  //     value: () => false,
  //     message: ,
  //   },
  // },

  const regex = /.(?:jpeg|gif|png)$/;

  const formValidations = {
    image: {
      required: { value: true, message: 'Arquivo obrigatório' },
      validate: {
        lessThen10MB: img =>
          img[0]?.size < 10000000 || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: img =>
          regex.test(img[0]?.name) ||
          'Somente são aceitos arquivos, PNG, JPEG e GIF',
      },
    },
    title: {
      required: { value: true, message: 'Titulo obrigatório' },
      minLength: { value: 2, message: 'Mínimo de 2 caracteres' },
      maxLength: { value: 20, message: 'Máximo de 20 caracteres' },
    },
    description: {
      required: { value: true, message: 'Descrição obrigatória' },
      maxLength: { value: 65, message: 'Máximo de 65 caracteres' },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation((data: any) => api.post('api/images', data), {
    onSuccess: response => {
      // queryClient.
    },
  });

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  console.log('errors', errors);

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'error',
        });
      } else {
        mutation.mutateAsync({ ...data, url: imageUrl });

        toast({
          description: 'Sua imagem foi cadastrada com sucesso.',
          status: 'success',
        });
      }
    } catch {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
      toast({
        description: 'Ocorreu um erro ao tentar cadastrar sua imagem.',
        status: 'error',
      });
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      setImageUrl('');
      setLocalImageUrl('');
      reset({ url: '', title: '', description: '' });
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          name="image"
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          name="title"
          error={errors.title}
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          name="description"
          error={errors.description}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
