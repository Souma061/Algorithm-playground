interface StepDescriptionProps {
  description: string;
  currentStep: number;
  totalSteps: number;
}

export function StepDescription({ description }: StepDescriptionProps) {
  return (
    <div className="w-full text-center py-4 px-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <p className="text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-300 leading-snug">
        {description || "Initializing algorithm..."}
      </p>
    </div>
  );
}
