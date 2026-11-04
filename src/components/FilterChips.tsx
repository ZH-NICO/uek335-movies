import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Chip, Menu } from "react-native-paper";

import type { MovieFilters } from "@/api/movieApi";

interface FilterOption {
  label: string;
  value: string;
}

// Genres
const GENRE_OPTIONS: FilterOption[] = [
  "Action",
  "Animation",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
].map((genre) => ({ label: genre, value: genre }));

// The value is the start of the year, e.g. "199" matches every year from 1990 to 1999.
const DECADE_OPTIONS: FilterOption[] = ["197", "198", "199", "200", "201", "202"].map((start) => ({
  label: `${start}0s`,
  value: start,
}));

//die Werte gehen später ans Backend
const RATING_OPTIONS: FilterOption[] = ["7", "8", "9"].map((rating) => ({
  label: `IMDb ≥ ${rating}`,
  value: rating,
}));

interface FilterChipProps {
  label: string;
  options: FilterOption[];
  value?: string;
  onChange: (value?: string) => void;
}

// One chip that opens a menu with its options.
// When a value is selected, the chip shows it and an "x" to remove the filter.
function FilterChip({ label, options, value, onChange }: FilterChipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  function select(newValue?: string) {
    setIsOpen(false);
    onChange(newValue);
  }

  return (
    <Menu
      visible={isOpen}
      onDismiss={() => setIsOpen(false)}
      anchor={
        <Chip
          selected={selected !== undefined}
          showSelectedOverlay
          icon={selected ? undefined : "chevron-down"}
          onPress={() => setIsOpen(true)}
          onClose={selected ? () => select(undefined) : undefined}
          closeIconAccessibilityLabel={`Remove ${label} filter`}
        >
          {selected ? selected.label : label}
        </Chip>
      }
    >
      {options.map((option) => (
        <Menu.Item key={option.value} title={option.label} onPress={() => select(option.value)} />
      ))}
    </Menu>
  );
}

interface FilterChipsProps {
  filters: MovieFilters;
  onChange: (filters: MovieFilters) => void;
}

// Filters for genre, decade and IMDb rating below the search bar.
export function FilterChips({ filters, onChange }: FilterChipsProps) {
  return (
    <View style={styles.row}>
      <FilterChip
        label="Genre"
        options={GENRE_OPTIONS}
        value={filters.genre}
        onChange={(genre) => onChange({ ...filters, genre })}
      />
      <FilterChip
        label="Year"
        options={DECADE_OPTIONS}
        value={filters.year}
        onChange={(year) => onChange({ ...filters, year })}
      />
      <FilterChip
        label="IMDb"
        options={RATING_OPTIONS}
        value={filters.minRating?.toString()}
        onChange={(rating) => onChange({ ...filters, minRating: rating ? Number(rating) : undefined })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Chips wrap to a second line on small screens instead of being cut off.
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
