import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AddAssetFormValues, AddAssetSchema } from "../model/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTransaction } from "@/entities/Portfolio";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import * as styles from "./AddAssetForm.module.scss";

interface AddAssetFormProps {
  onSuccess: () => void;
}

export const AddAssetForm = ({ onSuccess }: AddAssetFormProps) => {
  const dispath = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddAssetFormValues>({
    resolver: zodResolver(AddAssetSchema),
  });

  const onSubmit = (values: AddAssetFormValues) => {
    dispath(
      addTransaction({
        id: crypto.randomUUID(),
        type: "buy",
        asset: values.name,
        symbol: values.symbol,
        amount: values.amount,
        price: values.price,
        date: values.date,
      }),
    );

    onSuccess();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Input
        id="symbol"
        label="Ticker"
        placeholder="BTC"
        error={errors.symbol?.message}
        {...register("symbol")}
      />

      <Input
        id="name"
        label="Name"
        placeholder="Bitcoin"
        error={errors.name?.message}
        {...register("name")}
      />

      <div className={styles.row}>
        <Input
          id="amount"
          label="Amount"
          type="number"
          step="any"
          placeholder="0.5"
          error={errors.amount?.message}
          {...register("amount")}
        />

        <Input
          id="price"
          label="Price"
          type="number"
          step="any"
          placeholder="65000"
          error={errors.price?.message}
          {...register("price")}
        />
      </div>

      <Input
        id="date"
        label="Date"
        type="date"
        error={errors.date?.message}
        {...register("date")}
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isSubmitting}
      >
        Add asset
      </Button>
    </form>
  );
};
