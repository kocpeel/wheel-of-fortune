import { type NextRequest, NextResponse } from "next/server"

// Mock data structure matching the FastAPI backend
const mockStudents = [
  { id: 1, name: "Anna Kowalska", class_name: "3A" },
  { id: 2, name: "Jan Nowak", class_name: "3A" },
  { id: 3, name: "Maria Wiśniewska", class_name: "3A" },
  { id: 4, name: "Piotr Zieliński", class_name: "3B" },
  { id: 5, name: "Katarzyna Dąbrowska", class_name: "3B" },
  { id: 6, name: "Tomasz Lewandowski", class_name: "2A" },
  { id: 7, name: "Agnieszka Wójcik", class_name: "2A" },
  { id: 8, name: "Michał Kamiński", class_name: "2B" },

  { id: 9, name: "Paweł Kaczmarek", class_name: "1A" },
  { id: 10, name: "Ewa Piotrowska", class_name: "1A" },
  { id: 11, name: "Łukasz Grabowski", class_name: "1A" },
  { id: 12, name: "Monika Pawlak", class_name: "1A" },
  { id: 13, name: "Krzysztof Michalski", class_name: "1B" },
  { id: 14, name: "Joanna Król", class_name: "1B" },
  { id: 15, name: "Marek Wieczorek", class_name: "1B" },
  { id: 16, name: "Dorota Jankowska", class_name: "1B" },
  { id: 17, name: "Artur Baran", class_name: "1C" },
  { id: 18, name: "Patrycja Malinowska", class_name: "1C" },
  { id: 19, name: "Adam Sikora", class_name: "1C" },
  { id: 20, name: "Justyna Walczak", class_name: "1C" },
  { id: 21, name: "Damian Zając", class_name: "1D" },
  { id: 22, name: "Sylwia Gajewska", class_name: "1D" },
  { id: 23, name: "Rafał Sawicki", class_name: "1D" },
  { id: 24, name: "Paulina Maciejewska", class_name: "1D" },

  { id: 25, name: "Jakub Czarnecki", class_name: "2A" },
  { id: 26, name: "Magdalena Sokołowska", class_name: "2A" },
  { id: 27, name: "Sebastian Szczepański", class_name: "2A" },
  { id: 28, name: "Natalia Kołodziej", class_name: "2A" },
  { id: 29, name: "Wojciech Kubiak", class_name: "2B" },
  { id: 30, name: "Karolina Lis", class_name: "2B" },
  { id: 31, name: "Dawid Wilk", class_name: "2B" },
  { id: 32, name: "Izabela Chmielewska", class_name: "2B" },
  { id: 33, name: "Mateusz Mróz", class_name: "2C" },
  { id: 34, name: "Aleksandra Borkowska", class_name: "2C" },
  { id: 35, name: "Bartosz Ciesielski", class_name: "2C" },
  { id: 36, name: "Marta Zakrzewska", class_name: "2C" },
  { id: 37, name: "Grzegorz Borowski", class_name: "2D" },
  { id: 38, name: "Beata Tomczak", class_name: "2D" },
  { id: 39, name: "Adrian Wrona", class_name: "2D" },
  { id: 40, name: "Elżbieta Domagała", class_name: "2D" },

  { id: 41, name: "Konrad Adamczyk", class_name: "3A" },
  { id: 42, name: "Natalia Bukowska", class_name: "3A" },
  { id: 43, name: "Szymon Bednarek", class_name: "3A" },
  { id: 44, name: "Julia Olejniczak", class_name: "3A" },
  { id: 45, name: "Dominik Prus", class_name: "3B" },
  { id: 46, name: "Weronika Muszyńska", class_name: "3B" },
  { id: 47, name: "Marcin Orłowski", class_name: "3B" },
  { id: 48, name: "Emilia Błaszczyk", class_name: "3B" },
  { id: 49, name: "Patryk Kozłowski", class_name: "3C" },
  { id: 50, name: "Oliwia Urban", class_name: "3C" },
  { id: 51, name: "Kamil Krawczyk", class_name: "3C" },
  { id: 52, name: "Alicja Wysocka", class_name: "3C" },
  { id: 53, name: "Maciej Sadowski", class_name: "3D" },
  { id: 54, name: "Sandra Górska", class_name: "3D" },
  { id: 55, name: "Piotr Mazur", class_name: "3D" },
  { id: 56, name: "Agnieszka Czarnecka", class_name: "3D" },

  { id: 57, name: "Łukasz Ostrowski", class_name: "4A" },
  { id: 58, name: "Dominika Dudek", class_name: "4A" },
  { id: 59, name: "Norbert Pawłowski", class_name: "4A" },
  { id: 60, name: "Weronika Polak", class_name: "4A" },
  { id: 61, name: "Filip Górecki", class_name: "4B" },
  { id: 62, name: "Ewelina Zawadzka", class_name: "4B" },
  { id: 63, name: "Radosław Wojciechowski", class_name: "4B" },
  { id: 64, name: "Izabela Kulesza", class_name: "4B" },
  { id: 65, name: "Damian Kwiatkowski", class_name: "4C" },
  { id: 66, name: "Marta Olszewska", class_name: "4C" },
  { id: 67, name: "Michał Piątek", class_name: "4C" },
  { id: 68, name: "Kinga Pawlak", class_name: "4C" },
  { id: 69, name: "Andrzej Wróblewski", class_name: "4D" },
  { id: 70, name: "Natalia Pawlik", class_name: "4D" },
  { id: 71, name: "Przemysław Białek", class_name: "4D" },
  { id: 72, name: "Kamila Trojan", class_name: "4D" },

  // kolejne 36 uczniów (dla pełnej setki)
  { id: 73, name: "Paweł Krupa", class_name: "1A" },
  { id: 74, name: "Sylwia Matysiak", class_name: "1B" },
  { id: 75, name: "Tomasz Bartosz", class_name: "1C" },
  { id: 76, name: "Karolina Dziedzic", class_name: "1D" },
  { id: 77, name: "Łukasz Grzelak", class_name: "2A" },
  { id: 78, name: "Joanna Michalak", class_name: "2B" },
  { id: 79, name: "Mateusz Pawlikowski", class_name: "2C" },
  { id: 80, name: "Justyna Krupa", class_name: "2D" },
  { id: 81, name: "Bartosz Janik", class_name: "3A" },
  { id: 82, name: "Aleksandra Wieczorek", class_name: "3B" },
  { id: 83, name: "Michał Roman", class_name: "3C" },
  { id: 84, name: "Monika Stępień", class_name: "3D" },
  { id: 85, name: "Patryk Kaczmarczyk", class_name: "4A" },
  { id: 86, name: "Natalia Zawisza", class_name: "4B" },
  { id: 87, name: "Kamil Sobczak", class_name: "4C" },
  { id: 88, name: "Oliwia Rogowska", class_name: "4D" },
  { id: 89, name: "Damian Nowicki", class_name: "1A" },
  { id: 90, name: "Magdalena Klimek", class_name: "1B" },
  { id: 91, name: "Wojciech Tomczyk", class_name: "1C" },
  { id: 92, name: "Alicja Brzezińska", class_name: "1D" },
  { id: 93, name: "Szymon Rybak", class_name: "2A" },
  { id: 94, name: "Emilia Kaczor", class_name: "2B" },
  { id: 95, name: "Norbert Maj", class_name: "2C" },
  { id: 96, name: "Dominika Leszczyńska", class_name: "2D" },
  { id: 97, name: "Łukasz Konieczny", class_name: "3A" },
  { id: 98, name: "Julia Bednarska", class_name: "3B" },
  { id: 99, name: "Marek Oleksy", class_name: "3C" },
  { id: 100, name: "Karolina Musiał", class_name: "3D" },
  { id: 101, name: "Rafał Cichoń", class_name: "4A" },
  { id: 102, name: "Marta Kopeć", class_name: "4B" },
  { id: 103, name: "Adam Dziedzic", class_name: "4C" },
  { id: 104, name: "Ewelina Pawlicka", class_name: "4D" },
  { id: 105, name: "Krzysztof Żak", class_name: "1A" },
  { id: 106, name: "Paulina Kędzierska", class_name: "2B" },
  { id: 107, name: "Jakub Cieślak", class_name: "3C" },
  { id: 108, name: "Aleksandra Banaś", class_name: "4D" },
]


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const className = searchParams.get("class_name")
  const sortByClass = searchParams.get("sort_by_class") === "true"

  let students = [...mockStudents]

  // Filter by class if provided
  if (className) {
    students = students.filter((s) => s.class_name === className)
  }

  // Sort by class if requested
  if (sortByClass) {
    students = students.sort((a, b) => a.class_name.localeCompare(b.class_name))
  }

  return NextResponse.json({ students })
}
