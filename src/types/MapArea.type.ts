export interface MapArea {
  name: string;
  faction: string;
  type: 'Castle' | 'Town' | 'Village';
  coordinates?: [number, number]; // [x, y] coordinates for positioning on map
}
