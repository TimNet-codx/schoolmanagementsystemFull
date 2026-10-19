import { ArrowUpDown, ListFilter } from "lucide-react";
import { ReactNode } from "react";
import TableSearch from "./TableSearch";

/**
 * Shared card for every /list page: title + count on the left,
 * search / filter / sort / create on the right, then the table and pagination
 * passed in as children.
 */
const ListCard = ({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode; // e.g. <FormContainer type="create" />
  children: ReactNode;
}) => {
  return (
    <div className="p-4 bg-[#F6F8FB] min-h-full">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-[11px] text-gray-500">{subtitle}</p>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                type="button"
                aria-label="Filter"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
              >
                <ListFilter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                aria-label="Sort"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
              {action}
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default ListCard;