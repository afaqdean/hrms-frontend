import type { Employee } from '../../../interfaces/Employee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import avatar from '@/public/assets/avatar.jpg';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

type EmployeeListProp = {
  employees: Employee[] | undefined; // List of employees (optional)
  setter?: (index: number) => void; // Function to set the selected employee index
  scrollParentStyles?: string;
};

// Search bar component for filtering employees
export const SearchBar = ({
  query,
  setQuery,
  className,
}: {
  query: string; // Current search query
  setQuery: React.Dispatch<React.SetStateAction<string>>; // Function to update search query
  className?: string; // Additional styling classes (optional)
}) => {
  return (
    <div className={`flex w-full items-center rounded-lg border-2 border-secondary-100 bg-white shadow-sm ${className}`}>
      <Input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full rounded-none border-none bg-white py-0 text-sm text-gray-600 shadow-none outline-none placeholder:text-gray-400"
      />
      <HiOutlineSearch className="mr-2 text-gray-400" />
    </div>
  );
};

// Employee list component
const Employees: React.FC<EmployeeListProp> = ({ employees, setter, scrollParentStyles }) => {
  const [query, setQuery] = useState<string>(''); // State for storing search query
  const { slug } = useParams(); // Get the currently selected employee ID from URL
  const employeeId = Array.isArray(slug) ? slug[0] : slug;

  // Track previous employee ID for smooth scrolling
  const previousEmployeeIdRef = useRef<string | null>(null);

  // Refs for scroll container and selected employee
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedEmployeeRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Memoized filter to avoid unnecessary recalculations
  const filteredEmployees = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = employees
      ?.filter((employee) => {
        const employeeName = employee.name?.trim().toLowerCase();

        if (!employeeName) {
          return false;
        }

        // Match full name start
        if (employeeName.startsWith(normalizedQuery)) {
          return true;
        }

        // Match any word in the name that starts with the query
        const nameWords = employeeName.split(' ');
        return nameWords.some(word => word.startsWith(normalizedQuery));
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    // If there's a selected employee, move it to the top
    if (employeeId && filtered) {
      const selectedEmployeeIndex = filtered.findIndex(emp => emp._id === employeeId);

      if (selectedEmployeeIndex > 0) {
        // Remove the selected employee from its current position
        const selectedEmployee = filtered.splice(selectedEmployeeIndex, 1)[0];
        // Add it to the beginning of the array
        if (selectedEmployee) {
          filtered.unshift(selectedEmployee);
        }
      }
    }

    return filtered;
  }, [employees, query, employeeId]);

  // Smooth scroll to selected employee with transition from previous position
  useEffect(() => {
    if (employeeId && selectedEmployeeRefs.current[employeeId] && scrollContainerRef.current) {
      const selectedElement = selectedEmployeeRefs.current[employeeId];
      const container = scrollContainerRef.current;
      const previousEmployeeId = previousEmployeeIdRef.current;

      if (selectedElement && container) {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          // Check if the selected element is visible in the container
          const containerRect = container.getBoundingClientRect();
          const selectedRect = selectedElement.getBoundingClientRect();

          // Calculate if element is visible
          const isVisible = selectedRect.top >= containerRect.top && selectedRect.bottom <= containerRect.bottom;

          // If there's a previous employee and element is not visible, scroll smoothly
          if (previousEmployeeId && selectedEmployeeRefs.current[previousEmployeeId] && !isVisible) {
            // Calculate target scroll position to center the new element
            const selectedOffsetTop = selectedElement.offsetTop;
            const containerHeight = container.clientHeight;
            const elementHeight = selectedElement.clientHeight;
            const targetScrollTop = selectedOffsetTop - (containerHeight / 2) + (elementHeight / 2);

            // Smooth scroll to the target position
            container.scrollTo({
              top: Math.max(0, targetScrollTop),
              behavior: 'smooth',
            });
          } else if (!isVisible) {
            // If no previous employee or element not visible, scroll to center
            const selectedOffsetTop = selectedElement.offsetTop;
            const containerHeight = container.clientHeight;
            const elementHeight = selectedElement.clientHeight;
            const centeredScrollTop = selectedOffsetTop - (containerHeight / 2) + (elementHeight / 2);

            container.scrollTo({
              top: Math.max(0, centeredScrollTop),
              behavior: 'smooth',
            });
          }
          // If element is already visible, no scrolling needed
        });
      }

      // Update the previous employee ID reference
      previousEmployeeIdRef.current = employeeId;
    }
  }, [employeeId]);

  // Function to set ref for each employee button
  const setEmployeeRef = (employeeId: string) => (el: HTMLButtonElement | null) => {
    selectedEmployeeRefs.current[employeeId] = el;
  };

  return (
    <div className="mb-2  rounded-2xl bg-white px-2 py-4 md:mb-0 md:h-full md:p-4">

      {/* Display total number of employees */}
      <p className="my-2  text-sm text-secondary-300 md:text-base xxl:my-4">
        {employees && employees.length > 0
          ? `${employees.length} ${employees.length === 1 ? 'Employee' : 'Employees'}`
          : 'No Employees'}
      </p>

      {/* Search bar for filtering employees */}
      <SearchBar className="h-12 md:mb-4" query={query} setQuery={setQuery} />

      {/* Employee list container with scrollable view for larger screens */}
      <div
        className={`md:scrollbar mt-4 h-auto overflow-y-scroll md:mt-0 md:h-[52vh] lg:h-[48vh] xl:h-[47vh] xxl:h-[57vh] ${scrollParentStyles}`}
        style={{ scrollBehavior: 'smooth' }}
        ref={scrollContainerRef}
      >
        <ul className="mx-2">
          {filteredEmployees?.map((employee) => {
            // Find the original index of the employee in the full list
            const originalIndex = employees?.findIndex(e => e._id === employee._id);
            const isSelected = employee._id === employeeId;

            return (
              <Button
                key={employee._id}
                variant="outline"
                className={`group my-2 flex w-full  items-center justify-center  px-2  py-4 duration-300 hover:cursor-pointer md:my-4 md:justify-between md:px-3 md:py-4 xl:h-16 xl:p-4 xxl:h-20 
                  ${isSelected ? ' border-2 border-secondary-300 bg-secondary-100' : 'border-none'}`}
                onClick={() => {
                  if (originalIndex !== undefined && originalIndex !== -1) {
                    setter?.(originalIndex); // Call setter function
                  }
                }}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && originalIndex !== undefined && originalIndex !== -1) {
                    setter?.(originalIndex);
                  }
                }}
                ref={setEmployeeRef(employee._id)}
              >
                {/* Employee profile image */}
                <Image
                  src={employee?.profileImage || avatar}
                  alt={employee.name}
                  height={40}
                  width={40}
                  className="size-10 rounded-full border-2 border-secondary-200 md:size-10 xl:size-14"

                />

                {/* Employee details (name and position) */}
                <div className="flex w-full flex-row items-center justify-between  rounded-lg py-2">
                  <p className="text-sm font-semibold">
                    <span className="md:block xl:hidden">{employee.name.length > 7 ? `${employee.name.substring(0, 10)}...` : employee.name}</span>

                    <span className="hidden xl:block">{employee.name.length > 17 ? `${employee.name.substring(0, 10)}...` : employee.name}</span>
                  </p>
                  {/* Position badge with hover effect */}
                  <div
                    className={`w-fit rounded-full px-1 py-0.5 text-primary-100 group-hover:bg-primary-100 group-hover:text-white md:px-2 md:py-1 
                      ${isSelected ? 'bg-primary-100 text-white' : ''}`}
                  >
                    <p className="rounded-full px-2 py-1 text-sm">
                      {/* Mobile: Truncated last word */}
                      <span className="block md:hidden">
                        {(() => {
                          const position = employee?.position || '';
                          const words = position.split(' ');

                          const shortened = words.length > 1
                            ? `${words.slice(0, -1).join(' ')} ${words[words.length - 1]?.slice(0, 3) || ''}`
                            : position;

                          return shortened.length > 12 ? `${shortened.slice(0, 12)}...` : shortened;
                        })()}
                      </span>

                      {/* Medium screens: Truncated position */}
                      <span className="hidden md:block xl:hidden">
                        {(() => {
                          const position = employee?.position || '';
                          return position.length > 15
                            ? `${position.slice(0, 15)}...`
                            : position.split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(' ');
                        })()}
                      </span>

                      {/* Large screens and up: Full position text */}
                      <span className="hidden xl:block">
                        {employee?.position
                          ?.split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                          .join(' ')}
                      </span>
                    </p>

                  </div>
                </div>
              </Button>
            );
          })}

          {/* Show message when no employees match the search query */}
          {filteredEmployees?.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-500">
              No employees found.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Employees;
