import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface AssignmentBadgeProps {
	assignment: string;
}

export const AssignmentBadge = ({ assignment }: AssignmentBadgeProps) => {
	return (
		<div className="flex flex-col items-center justify-center text-center fixed top-0 left-0 w-full h-1/4">
			<div className="py-2 px-4 bg-orange-500 text-white rounded-full">
				<Select>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="課題を選択" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="light">Light</SelectItem>
						<SelectItem value="dark">Dark</SelectItem>
						<SelectItem value="system">System</SelectItem>
					</SelectContent>
				</Select>
			</div>
			{/* <Dialog>
				<DialogTrigger>
					<button className="py-2 px-4 bg-orange-500 text-white rounded-full">{assignment}</button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle><div className="flex items-center justify-center">課題を選択</div></DialogTitle>
						<DialogDescription>
							<div className="flex items-center justify-center my-10">
              <Select>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Theme" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="light">Light</SelectItem>
									<SelectItem value="dark">Dark</SelectItem>
									<SelectItem value="system">System</SelectItem>
								</SelectContent>
							</Select>
              </div>
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog> */}
		</div>
	);
};
