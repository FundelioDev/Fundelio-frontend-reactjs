import { storageApi } from '@/api/storageApi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  IconAlertCircle,
  IconCalendar,
  IconFlag,
  IconMail,
  IconPhone,
  IconPhoto,
  IconShield,
  IconUpload,
  IconUser,
  IconUserCircle,
  IconMapPin,
  IconFileText,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import Cropper from 'react-easy-crop';
import * as z from 'zod';
import { getCroppedImg } from '../../../../utils/crop-image';
import { useRoles } from '../../roles/context/roles-context';
import { useUsers } from '../context/users-context';

const formSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (phone) =>
        !phone ||
        phone === '' ||
        /^(0|84|\+84)([3|5|7|8|9])([0-9]{8})$/.test(phone.replace(/\s/g, '')),
      {
        message:
          'Số điện thoại không hợp lệ. Định dạng: 0xxxxxxxxx hoặc +84xxxxxxxxx',
      }
    ),
  firstName: z.string().min(1, 'Vui lòng nhập tên'),
  lastName: z.string().min(1, 'Vui lòng nhập họ'),
  nickname: z.string().optional(),
  avatarUrl: z.string().optional(),
  avatarFile: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size >= 1024, // 1KB
      'File phải lớn hơn 1KB'
    )
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024, // 5MB
      'File không được vượt quá 5MB'
    )
    .refine(
      (file) =>
        !file || ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
      'Chỉ chấp nhận file định dạng JPG, JPEG hoặc PNG'
    ),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  city: z.string().optional(),
  biography: z.string().optional(),
  isVerified: z.boolean(),
  roleIds: z.array(z.string()),
});

export function UsersActionDialog({ currentRow, open, onOpenChange }) {
  const { updateUser, createUser } = useUsers();
  const { roles } = useRoles();
  const isEdit = !!currentRow;
  const [isUploading, setIsUploading] = useState(false);

  console.log('Current user roles:', currentRow?.roles);
  console.log('Available roles:', roles);

  const defaultRoleIds = useMemo(() => {
    if (
      currentRow?.roles &&
      Array.isArray(currentRow.roles) &&
      currentRow.roles.length > 0
    ) {
      console.log(
        'Vai trò người dùng chi tiết:',
        JSON.stringify(currentRow.roles, null, 2)
      );

      try {
        return currentRow.roles
          .map((role) => {
            return role.roleId || role.id || '';
          })
          .filter(Boolean);
      } catch (error) {
        console.error('Lỗi khi xử lý roleIds:', error);
        return [];
      }
    }
    return [];
  }, [currentRow]);

  console.log('Default roleIds:', defaultRoleIds);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: currentRow?.email || '',
      phoneNumber: currentRow?.phoneNumber || '',
      firstName: currentRow?.firstName || '',
      lastName: currentRow?.lastName || '',
      nickname: currentRow?.nickname || '',
      avatarUrl: currentRow?.avatarUrl || '',
      avatarFile: undefined,
      birthDate: currentRow?.birthDate || '',
      gender: currentRow?.gender || '',
      nationality: currentRow?.nationality || '',
      city: currentRow?.city || '',
      biography: currentRow?.biography || '',
      isVerified: currentRow?.isVerified || false,
      roleIds: defaultRoleIds,
    },
  });

  const onSubmit = async (values) => {
    try {
      console.log('Form values on submit:', values);

      setIsUploading(true);

      const avatarUrl = values.avatarUrl;

      if (isEdit && currentRow?.userId) {
        const changedFields = {};

        const isEmpty = (value) => {
          return value === '' || value === null || value === undefined;
        };

        const hasChanged = (newValue, oldValue) => {
          if (isEmpty(newValue) && isEmpty(oldValue)) {
            return false;
          }
          return newValue !== oldValue;
        };

        if (hasChanged(values.email, currentRow.email)) {
          changedFields.email = values.email;
        }

        if (
          hasChanged(values.phoneNumber, currentRow.phoneNumber) &&
          !isEmpty(values.phoneNumber)
        ) {
          changedFields.phoneNumber = values.phoneNumber;
        }

        if (hasChanged(values.firstName, currentRow.firstName)) {
          changedFields.firstName = values.firstName;
        }

        if (hasChanged(values.lastName, currentRow.lastName)) {
          changedFields.lastName = values.lastName;
        }

        if (
          hasChanged(values.nickname, currentRow.nickname) &&
          !isEmpty(values.nickname)
        ) {
          changedFields.nickname = values.nickname;
        }

        const currentAvatar = currentRow.avatarUrl;
        if (hasChanged(avatarUrl, currentAvatar) && !isEmpty(avatarUrl)) {
          changedFields.avatarUrl = avatarUrl;
        }

        if (
          hasChanged(values.birthDate, currentRow.birthDate) &&
          !isEmpty(values.birthDate)
        ) {
          changedFields.birthDate = values.birthDate;
        }

        if (
          hasChanged(values.gender, currentRow.gender) &&
          !isEmpty(values.gender)
        ) {
          changedFields.gender = values.gender;
        }

        if (
          hasChanged(values.nationality, currentRow.nationality) &&
          !isEmpty(values.nationality)
        ) {
          changedFields.nationality = values.nationality;
        }

        if (hasChanged(values.city, currentRow.city) && !isEmpty(values.city)) {
          changedFields.city = values.city;
        }

        if (
          hasChanged(values.biography, currentRow.biography) &&
          !isEmpty(values.biography)
        ) {
          changedFields.biography = values.biography;
        }

        if (hasChanged(values.isVerified, currentRow.isVerified)) {
          changedFields.isVerified = values.isVerified;
        }

        let currentRoleIds = [];
        try {
          currentRoleIds = currentRow.roles
            .map((role) => {
              return role.roleId || role.id || '';
            })
            .filter((id) => id !== '');
        } catch (error) {
          console.error('Lỗi khi xử lý roleIds:', error);
        }

        const hasRoleChanged =
          JSON.stringify(values.roleIds.filter((id) => !isEmpty(id))) !==
          JSON.stringify(currentRoleIds);
        if (
          hasRoleChanged &&
          values.roleIds.length > 0 &&
          !isEmpty(values.roleIds[0])
        ) {
          console.log('roleIds đã thay đổi:', {
            mới: values.roleIds,
            cũ: currentRoleIds,
          });
          changedFields.roleIds = values.roleIds.filter((id) => !isEmpty(id));
        }

        if (Object.keys(changedFields).length === 0) {
          toast({
            title: 'Thông báo',
            description: 'Không có thông tin nào được thay đổi.',
          });
          setIsUploading(false);
          return;
        }

        console.log('Payload sẽ gửi:', changedFields);

        const oldAvatar =
          currentRow.avatarUrl && currentRow.avatarUrl.trim() !== ''
            ? currentRow.avatarUrl
            : null;

        await updateUser(currentRow.userId, changedFields);

        if (oldAvatar && values.avatarUrl && values.avatarUrl !== oldAvatar) {
          try {
            console.log('Đang xóa avatar cũ:', oldAvatar);
            await storageApi.deleteSingleFile(oldAvatar);
            console.log('Đã xóa avatar cũ thành công');
          } catch (deleteError) {
            console.error('Lỗi khi xóa avatar cũ:', deleteError);
            toast({
              title: 'Cảnh báo',
              description: 'Cập nhật thành công nhưng không thể xóa avatar cũ.',
              variant: 'destructive',
            });
          }
        }
      } else {
        const userData = {};

        userData.email = values.email;
        userData.firstName = values.firstName;
        userData.lastName = values.lastName;
        userData.isVerified = values.isVerified;

        if (
          values.roleIds &&
          values.roleIds.length > 0 &&
          values.roleIds[0] !== ''
        ) {
          userData.roleIds = values.roleIds.filter((id) => id !== '');
        }

        if (values.phoneNumber && values.phoneNumber.trim() !== '') {
          userData.phoneNumber = values.phoneNumber;
        }
        if (values.nickname && values.nickname.trim() !== '') {
          userData.nickname = values.nickname;
        }
        if (values.avatarUrl && values.avatarUrl.trim() !== '') {
          userData.avatarUrl = values.avatarUrl;
        }
        if (values.birthDate && values.birthDate.trim() !== '') {
          userData.birthDate = values.birthDate;
        }
        if (values.gender && values.gender.trim() !== '') {
          userData.gender = values.gender;
        }
        if (values.nationality && values.nationality.trim() !== '') {
          userData.nationality = values.nationality;
        }
        if (values.city && values.city.trim() !== '') {
          userData.city = values.city;
        }
        if (values.biography && values.biography.trim() !== '') {
          userData.biography = values.biography;
        }

        console.log('Payload tạo mới user:', userData);
        await createUser(userData);
      }
      setIsUploading(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Lỗi',
        description: 'Đã xảy ra lỗi. Vui lòng thử lại.',
        variant: 'destructive',
      });
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[800px] p-0 gap-0 overflow-hidden dark:bg-zinc-700 dark:border-zinc-800 border-slate-200 shadow-lg'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className='w-full'
        >
          <DialogHeader className='p-6 pb-2 border-b bg-slate-50 dark:bg-zinc-800'>
            <DialogTitle className='text-xl'>
              {isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
            </DialogTitle>
            <DialogDescription className='text-slate-500'>
              {isEdit
                ? 'Cập nhật thông tin người dùng'
                : 'Thêm người dùng mới vào hệ thống'}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className='h-[65vh] px-6 py-4'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className='bg-white dark:border-zinc-800 dark:bg-zinc-800 p-5 rounded-md border border-slate-200 shadow-sm'
                >
                  <h3 className='text-md font-medium text-slate-900 dark:text-slate-100 mb-4'>
                    Thông tin cơ bản
                  </h3>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <IconMail className='absolute left-3 top-2.5 h-4 w-4 text-slate-500' />
                              <Input
                                placeholder='example@email.com'
                                {...field}
                                className='bg-slate-50 dark:bg-zinc-800 pl-10'
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='phoneNumber'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <IconPhone className='absolute left-3 top-2.5 h-4 w-4 text-slate-500' />
                              <Input
                                placeholder='Nhập số điện thoại'
                                {...field}
                                className='bg-slate-50 dark:bg-zinc-800 pl-10'
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='lastName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ</FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <IconUser className='absolute left-3 top-2.5 h-4 w-4 text-slate-500' />
                              <Input
                                placeholder='Nhập họ'
                                {...field}
                                className='bg-slate-50 dark:bg-zinc-800 pl-10'
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='firstName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên</FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <IconUser className='absolute left-3 top-2.5 h-4 w-4 text-slate-500' />
                              <Input
                                placeholder='Nhập tên'
                                {...field}
                                className='bg-slate-50 dark:bg-zinc-800 pl-10'
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className='bg-white dark:bg-zinc-800 dark:border-zinc-800 p-5 rounded-md border border-slate-200 shadow-sm'
                >
                  <h3 className='text-md font-medium dark:text-slate-100 text-slate-900 mb-4'>
                    Thông tin bổ sung
                  </h3>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='nickname'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Biệt danh</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Nhập biệt danh'
                              {...field}
                              className='bg-slate-50 dark:bg-zinc-800'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='birthDate'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày sinh</FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <IconCalendar className='absolute left-3 top-2.5 h-4 w-4 text-slate-500' />
                              <Input
                                type='date'
                                placeholder='Nhập ngày sinh'
                                {...field}
                                className='bg-slate-50 dark:bg-zinc-800 pl-10'
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='gender'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giới tính</FormLabel>
                          <Select
                            value={field.value || ''}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className='bg-slate-50 dark:bg-zinc-800'>
                                <SelectValue placeholder='Chọn giới tính' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='male'>Nam</SelectItem>
                              <SelectItem value='female'>Nữ</SelectItem>
                              <SelectItem value='other'>Khác</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='nationality'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quốc tịch</FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <IconFlag className='absolute left-3 top-2.5 h-4 w-4 text-slate-500' />
                              <Input
                                placeholder='Nhập quốc tịch'
                                {...field}
                                className='bg-slate-50 dark:bg-zinc-800 pl-10'
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='city'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thành phố</FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <IconMapPin className='absolute left-3 top-2.5 h-4 w-4 text-slate-500' />
                              <Input
                                placeholder='Nhập thành phố'
                                {...field}
                                className='bg-slate-50 dark:bg-zinc-800 pl-10'
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='mt-4'>
                    <FormField
                      control={form.control}
                      name='biography'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiểu sử</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Nhập tiểu sử'
                              {...field}
                              className='bg-slate-50 dark:bg-zinc-800 min-h-[100px]'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className='bg-white dark:bg-zinc-800 dark:border-zinc-800 dark:text-slate-100 p-5 rounded-md border border-slate-200 shadow-sm'
                >
                  <h3 className='text-md font-medium text-slate-900 dark:text-slate-100 mb-4'>
                    Hình ảnh & Phân quyền
                  </h3>
                  <div className='grid grid-cols-1 gap-4'>
                    <FormField
                      control={form.control}
                      name='avatarUrl'
                      render={({ field }) => {
                        const [previewUrl, setPreviewUrl] = useState(
                          field.value || ''
                        );
                        const [localFile, setLocalFile] = useState(null);
                        const [isUploadingAvatar, setIsUploadingAvatar] =
                          useState(false);
                        const [showCropper, setShowCropper] = useState(false);
                        const [crop, setCrop] = useState({ x: 0, y: 0 });
                        const [zoom, setZoom] = useState(1);
                        const [croppedAreaPixels, setCroppedAreaPixels] =
                          useState(null);
                        const [originalImageUrl, setOriginalImageUrl] =
                          useState('');

                        useEffect(() => {
                          if (field.value && !localFile) {
                            setPreviewUrl(field.value);
                          }
                        }, [field.value, localFile]);

                        const handleFileChange = async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          if (
                            !['image/jpeg', 'image/jpg', 'image/png'].includes(
                              file.type
                            )
                          ) {
                            toast({
                              title: 'Định dạng không hỗ trợ',
                              description:
                                'Chỉ chấp nhận file định dạng JPG, JPEG hoặc PNG',
                              variant: 'destructive',
                            });
                            return;
                          }

                          if (file.size < 1024) {
                            toast({
                              title: 'File quá nhỏ',
                              description: 'File phải lớn hơn 1KB',
                              variant: 'destructive',
                            });
                            return;
                          }

                          if (file.size > 5 * 1024 * 1024) {
                            toast({
                              title: 'File quá lớn',
                              description: 'File không được vượt quá 5MB',
                              variant: 'destructive',
                            });
                            return;
                          }

                          const objectUrl = URL.createObjectURL(file);
                          setOriginalImageUrl(objectUrl);
                          setShowCropper(true);
                          setLocalFile(file);
                        };

                        const onCropComplete = (
                          croppedArea,
                          croppedAreaPixels
                        ) => {
                          setCroppedAreaPixels(croppedAreaPixels);
                        };

                        const uploadCroppedImage = async () => {
                          try {
                            if (
                              !croppedAreaPixels ||
                              !localFile ||
                              !originalImageUrl
                            )
                              return;

                            setIsUploadingAvatar(true);

                            const croppedImageBlob = await getCroppedImg(
                              originalImageUrl,
                              croppedAreaPixels
                            );

                            if (!croppedImageBlob) {
                              throw new Error('Không thể tạo ảnh đã cắt');
                            }

                            const croppedFile = new File(
                              [croppedImageBlob],
                              localFile.name,
                              { type: localFile.type }
                            );

                            const croppedPreviewUrl =
                              URL.createObjectURL(croppedImageBlob);
                            setPreviewUrl(croppedPreviewUrl);

                            const response = await storageApi.uploadSingleFile(
                              croppedFile,
                              'users'
                            );

                            console.log('Upload response:', response);

                            const responseData = response.data;

                            if (
                              responseData &&
                              responseData.success === true &&
                              responseData.data
                            ) {
                              const fileUrl = responseData.data.fileUrl;

                              if (fileUrl) {
                                console.log('File URL:', fileUrl);
                                field.onChange(fileUrl);

                                toast({
                                  title: 'Thành công',
                                  description: 'Đã tải lên ảnh đại diện đã cắt',
                                });

                                setShowCropper(false);
                              } else {
                                toast({
                                  title: 'Lỗi',
                                  description:
                                    'Không tìm thấy URL file trong phản hồi',
                                  variant: 'destructive',
                                });
                              }
                            } else {
                              toast({
                                title: 'Lỗi',
                                description:
                                  'Không thể tải lên hình ảnh. Vui lòng thử lại.',
                                variant: 'destructive',
                              });
                            }
                          } catch (error) {
                            console.error(
                              'Error uploading cropped file:',
                              error
                            );
                            toast({
                              title: 'Lỗi',
                              description:
                                'Đã xảy ra lỗi khi tải lên. Vui lòng thử lại.',
                              variant: 'destructive',
                            });
                          } finally {
                            setIsUploadingAvatar(false);
                          }
                        };

                        return (
                          <FormItem>
                            <FormLabel>Ảnh đại diện</FormLabel>
                            <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
                              <Avatar className='h-20 w-20 rounded-md border-2 border-slate-200'>
                                <AvatarImage
                                  src={
                                    previewUrl ||
                                    `https://ui-avatars.com/api/?name=${form.watch(
                                      'firstName'
                                    )}+${form.watch(
                                      'lastName'
                                    )}&size=80&background=random`
                                  }
                                  alt='Avatar preview'
                                />
                                <AvatarFallback className='rounded-md bg-slate-100 dark:bg-slate-600'>
                                  <IconUserCircle className='h-10 w-10 text-slate-400' />
                                </AvatarFallback>
                              </Avatar>
                              <div className='flex-1 space-y-2'>
                                <FormControl>
                                  <div className='relative'>
                                    <IconPhoto className='absolute left-3 top-2.5 h-4 w-4 text-slate-500' />
                                    <Input
                                      placeholder='https://example.com/avatar.jpg'
                                      {...field}
                                      className='bg-slate-50 dark:bg-zinc-800 pl-10'
                                      onChange={(e) => {
                                        field.onChange(e);
                                        if (e.target.value) {
                                          form.setValue(
                                            'avatarFile',
                                            undefined
                                          );
                                          setLocalFile(null);
                                        }
                                        setPreviewUrl(e.target.value);
                                      }}
                                    />
                                  </div>
                                </FormControl>

                                <div className='flex flex-col gap-2'>
                                  <label
                                    htmlFor='avatar-upload'
                                    className={`flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 transition-all cursor-pointer w-full ${
                                      isUploadingAvatar
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                    }`}
                                  >
                                    {isUploadingAvatar ? (
                                      <>
                                        <svg
                                          className='animate-spin h-4 w-4 text-slate-700'
                                          xmlns='http://www.w3.org/2000/svg'
                                          fill='none'
                                          viewBox='0 0 24 24'
                                        >
                                          <circle
                                            className='opacity-25'
                                            cx='12'
                                            cy='12'
                                            r='10'
                                            stroke='currentColor'
                                            strokeWidth='4'
                                          ></circle>
                                          <path
                                            className='opacity-75'
                                            fill='currentColor'
                                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                          ></path>
                                        </svg>
                                        <span>Đang tải lên...</span>
                                      </>
                                    ) : (
                                      <>
                                        <IconUpload className='h-4 w-4' />
                                        <span>Tải ảnh lên</span>
                                      </>
                                    )}
                                  </label>
                                  <input
                                    id='avatar-upload'
                                    type='file'
                                    accept='.jpg,.jpeg,.png'
                                    className='hidden'
                                    onChange={handleFileChange}
                                    disabled={isUploadingAvatar}
                                  />

                                  {localFile && !showCropper && (
                                    <div className='text-xs text-slate-500 flex items-center'>
                                      <IconAlertCircle className='h-3 w-3 mr-1' />
                                      {localFile.name} (
                                      {(localFile.size / 1024).toFixed(1)}KB)
                                    </div>
                                  )}

                                  <p className='text-xs text-slate-500'>
                                    PNG, JPG tối đa 5MB
                                  </p>
                                </div>
                              </div>
                            </div>
                            {showCropper && (
                              <div className='mt-4 border rounded-md p-4 bg-slate-50 dark:bg-zinc-800'>
                                <h4 className='text-sm font-medium mb-2'>
                                  Cắt ảnh đại diện
                                </h4>
                                <div className='relative h-[300px] w-full mb-4'>
                                  {originalImageUrl && (
                                    <Cropper
                                      image={originalImageUrl}
                                      crop={crop}
                                      zoom={zoom}
                                      aspect={1}
                                      onCropChange={setCrop}
                                      onCropComplete={onCropComplete}
                                      onZoomChange={setZoom}
                                      rotation={0}
                                      minZoom={1}
                                      maxZoom={3}
                                      cropShape='rect'
                                    />
                                  )}
                                </div>
                                <div className='flex items-center justify-between mb-4'>
                                  <span className='text-xs'>Thu phóng:</span>
                                  <input
                                    type='range'
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby='Zoom'
                                    onChange={(e) =>
                                      setZoom(Number(e.target.value))
                                    }
                                    className='w-full mx-2'
                                  />
                                </div>
                                <div className='flex justify-end gap-2'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={() => {
                                      setShowCropper(false);
                                      setOriginalImageUrl('');
                                      setLocalFile(null);
                                    }}
                                  >
                                    Hủy
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='default'
                                    size='sm'
                                    onClick={uploadCroppedImage}
                                    disabled={isUploadingAvatar}
                                  >
                                    {isUploadingAvatar
                                      ? 'Đang xử lý...'
                                      : 'Cắt và tải lên'}
                                  </Button>
                                </div>
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name='roleIds'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vai trò</FormLabel>
                          <Select
                            value={
                              field.value?.length > 0 ? field.value[0] : ''
                            }
                            onValueChange={(value) => {
                              console.log('Role selected:', value);
                              if (value) {
                                field.onChange([value]);
                                console.log('Field after change:', field.value);
                              }
                            }}
                          >
                            <FormControl>
                              <div className='relative'>
                                <IconShield className='absolute left-3 top-2.5 h-4 w-4 text-slate-500 z-10' />
                                <SelectTrigger className='bg-slate-50 dark:bg-zinc-800 pl-10'>
                                  <SelectValue placeholder='Chọn vai trò' />
                                </SelectTrigger>
                              </div>
                            </FormControl>
                            <SelectContent>
                              {roles.map((role) => {
                                const roleIdentifier = role.roleId;
                                return (
                                  <SelectItem
                                    key={roleIdentifier}
                                    value={roleIdentifier || ''}
                                  >
                                    {role.name}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='mt-4'>
                    <FormField
                      control={form.control}
                      name='isVerified'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-zinc-800'>
                          <div className='space-y-0.5'>
                            <FormLabel className='text-base'>
                              Xác minh Email
                            </FormLabel>
                            <div className='text-sm text-slate-500'>
                              {field.value
                                ? 'Người dùng đã được xác minh'
                                : 'Người dùng chưa được xác minh'}
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className='data-[state=checked]:bg-slate-900'
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              </form>
            </Form>
          </ScrollArea>
          <DialogFooter className='p-6 border-t flex gap-2'>
            <Button
              variant='outline'
              onClick={() => onOpenChange(false)}
              className='transition-all duration-200 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-900'
            >
              Hủy
            </Button>
            <Button
              type='submit'
              onClick={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting || isUploading}
              className='bg-primary transition-all dark:bg-slate-600 dark:text-slate-100 duration-200 hover:bg-primary/90 hover:shadow-lg hover:scale-105'
            >
              {form.formState.isSubmitting || isUploading ? (
                <div className='flex items-center gap-2'>
                  <svg
                    className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Đang xử lý...
                </div>
              ) : isEdit ? (
                'Cập nhật'
              ) : (
                'Thêm'
              )}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
