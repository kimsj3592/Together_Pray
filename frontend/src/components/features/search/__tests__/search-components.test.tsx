/**
 * Search Components Test Suite
 * Together Pray v2.0
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from '../SearchInput';
import { FilterChips } from '../FilterChips';
import { SortDropdown } from '../SortDropdown';
import { SearchFilterBar } from '../SearchFilterBar';

// Mock haptics
jest.mock('@/lib/haptics', () => ({
  haptics: {
    light: jest.fn(),
    medium: jest.fn(),
    heavy: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('SearchInput', () => {
  it('renders with placeholder', () => {
    render(
      <SearchInput
        value=""
        onChange={jest.fn()}
        placeholder="Search prayers"
      />
    );

    expect(screen.getByPlaceholderText('Search prayers')).toBeInTheDocument();
  });

  it('calls onChange after debounce delay', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(
      <SearchInput
        value=""
        onChange={onChange}
        debounceDelay={300}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    // Should not call immediately
    expect(onChange).not.toHaveBeenCalled();

    // Should call after debounce
    await waitFor(() => expect(onChange).toHaveBeenCalledWith('test'), {
      timeout: 500,
    });
  });

  it('shows clear button when value is present', () => {
    render(<SearchInput value="test" onChange={jest.fn()} />);

    const clearButton = screen.getByLabelText('검색어 지우기');
    expect(clearButton).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(<SearchInput value="test" onChange={onChange} />);

    const clearButton = screen.getByLabelText('검색어 지우기');
    await user.click(clearButton);

    expect(onChange).toHaveBeenCalledWith('');
  });

  it('shows loading indicator when loading prop is true', () => {
    render(<SearchInput value="" onChange={jest.fn()} loading={true} />);

    const loader = screen.getByRole('status', { hidden: true });
    expect(loader).toBeInTheDocument();
  });
});

describe('FilterChips', () => {
  const mockOptions = [
    { value: 'all', label: '전체', count: 24 },
    { value: 'praying', label: '기도중', count: 12 },
    { value: 'answered', label: '응답완료', count: 7 },
  ];

  it('renders all filter options', () => {
    render(
      <FilterChips
        options={mockOptions}
        value="all"
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText('전체')).toBeInTheDocument();
    expect(screen.getByText('기도중')).toBeInTheDocument();
    expect(screen.getByText('응답완료')).toBeInTheDocument();
  });

  it('shows count badges when provided', () => {
    render(
      <FilterChips
        options={mockOptions}
        value="all"
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('calls onChange when chip is clicked', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(
      <FilterChips
        options={mockOptions}
        value="all"
        onChange={onChange}
      />
    );

    await user.click(screen.getByText('기도중'));
    expect(onChange).toHaveBeenCalledWith('praying');
  });

  it('supports multiple selection', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(
      <FilterChips
        options={mockOptions}
        value={['all']}
        onChange={onChange}
        multiple={true}
      />
    );

    await user.click(screen.getByText('기도중'));
    expect(onChange).toHaveBeenCalledWith(['all', 'praying']);
  });

  it('shows check icon for selected chips', () => {
    render(
      <FilterChips
        options={mockOptions}
        value="praying"
        onChange={jest.fn()}
      />
    );

    const selectedChip = screen.getByText('기도중').closest('button');
    expect(selectedChip).toHaveClass('bg-[rgb(var(--color-primary-500))]');
  });
});

describe('SortDropdown', () => {
  const mockOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'most-prayed', label: '기도 많은순' },
  ];

  it('renders with selected option label', () => {
    render(
      <SortDropdown
        options={mockOptions}
        value="latest"
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText('최신순')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    const user = userEvent.setup();

    render(
      <SortDropdown
        options={mockOptions}
        value="latest"
        onChange={jest.fn()}
      />
    );

    await user.click(screen.getByText('최신순'));

    expect(screen.getByText('오래된순')).toBeInTheDocument();
    expect(screen.getByText('기도 많은순')).toBeInTheDocument();
  });

  it('calls onChange when option is selected', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(
      <SortDropdown
        options={mockOptions}
        value="latest"
        onChange={onChange}
      />
    );

    await user.click(screen.getByText('최신순'));
    await user.click(screen.getByText('오래된순'));

    expect(onChange).toHaveBeenCalledWith('oldest');
  });

  it('closes dropdown after selection', async () => {
    const user = userEvent.setup();

    render(
      <SortDropdown
        options={mockOptions}
        value="latest"
        onChange={jest.fn()}
      />
    );

    await user.click(screen.getByText('최신순'));
    await user.click(screen.getByText('오래된순'));

    expect(screen.queryByText('기도 많은순')).not.toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <div data-testid="outside">Outside</div>
        <SortDropdown
          options={mockOptions}
          value="latest"
          onChange={jest.fn()}
        />
      </div>
    );

    await user.click(screen.getByText('최신순'));
    expect(screen.getByText('오래된순')).toBeInTheDocument();

    await user.click(screen.getByTestId('outside'));
    expect(screen.queryByText('오래된순')).not.toBeInTheDocument();
  });
});

describe('SearchFilterBar', () => {
  const mockFilterOptions = [
    { value: 'all', label: '전체' },
    { value: 'praying', label: '기도중' },
  ];

  const mockSortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
  ];

  it('renders search input', () => {
    render(
      <SearchFilterBar
        searchValue=""
        onSearchChange={jest.fn()}
        showFilters={false}
        showSort={false}
      />
    );

    expect(screen.getByPlaceholderText('기도제목 검색')).toBeInTheDocument();
  });

  it('renders filter chips when provided', () => {
    render(
      <SearchFilterBar
        searchValue=""
        onSearchChange={jest.fn()}
        filterOptions={mockFilterOptions}
        filterValue="all"
        onFilterChange={jest.fn()}
        showFilters={true}
      />
    );

    expect(screen.getByText('전체')).toBeInTheDocument();
    expect(screen.getByText('기도중')).toBeInTheDocument();
  });

  it('renders sort dropdown when provided', () => {
    render(
      <SearchFilterBar
        searchValue=""
        onSearchChange={jest.fn()}
        sortOptions={mockSortOptions}
        sortValue="latest"
        onSortChange={jest.fn()}
        showSort={true}
      />
    );

    expect(screen.getByText('최신순')).toBeInTheDocument();
  });

  it('hides filters when showFilters is false', () => {
    render(
      <SearchFilterBar
        searchValue=""
        onSearchChange={jest.fn()}
        filterOptions={mockFilterOptions}
        filterValue="all"
        onFilterChange={jest.fn()}
        showFilters={false}
      />
    );

    expect(screen.queryByText('전체')).not.toBeInTheDocument();
  });

  it('hides sort when showSort is false', () => {
    render(
      <SearchFilterBar
        searchValue=""
        onSearchChange={jest.fn()}
        sortOptions={mockSortOptions}
        sortValue="latest"
        onSortChange={jest.fn()}
        showSort={false}
      />
    );

    expect(screen.queryByText('최신순')).not.toBeInTheDocument();
  });

  it('passes loading state to search input', () => {
    render(
      <SearchFilterBar
        searchValue=""
        onSearchChange={jest.fn()}
        searchLoading={true}
      />
    );

    const loader = screen.getByRole('status', { hidden: true });
    expect(loader).toBeInTheDocument();
  });
});
