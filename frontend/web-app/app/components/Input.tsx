import { useController, UseControllerProps } from "react-hook-form";
import { Label, TextInput } from "flowbite-react";

type Props = {
    label: string;
    type?: string;
    showLabel?: boolean;
    onFocus?: () => void;  // Добавляем onFocus в пропсы
} & UseControllerProps;

export default function Input(props: Props) {
    const { fieldState, field, formState } = useController({ ...props, defaultValue: '' });

    return (
        <div className='mb-3'>
            {props.showLabel && (
                <div className='mb-2 block'>
                    <Label htmlFor={field.name} value={props.label} />
                </div>
            )}
            <TextInput
                {...props}
                {...field}
                type={props.type || 'text'}
                placeholder={props.label}
                color={fieldState?.error ? 'failure' : !fieldState.isDirty ? '' : 'success'}
                onFocus={props.onFocus}  // Передаем onFocus в TextInput
            />
            
            {/*fieldState.error?.message && (
                <div className="mt-2 text-red-500 text-sm mb-2">}
                    {fieldState.error.message.split('\n').map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )*/}
            
        </div>
    );
}
