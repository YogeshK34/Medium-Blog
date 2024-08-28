import { Avatar } from "./BlogCard";

export const Appbar = () => {
    return (
        <div className="border-b flex justify-between items-center px-10 pb-4">
            <div className="pt-4 font-thin text-lg">
                Medium
            </div>
            <div className="flex items-center">
                <Avatar size={"small"} name={"YogeshKhutwad"} />
            </div>
        </div>
    );
}
