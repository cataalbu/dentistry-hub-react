export default function getPrescurtation(prescurtation) {
  switch (prescurtation) {
    case 'N':
      return 'Normal';
    case 'ADD':
      return 'Anterior Disc Displacemen';
    case 'LDD':
      return 'Lateral Disc Displacemen';
    case 'MDD':
      return 'Medial Disc Displacemen';
    default:
      return 'Normal';
  }
}
