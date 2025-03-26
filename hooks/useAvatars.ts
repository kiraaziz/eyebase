const avatar = [
    "Kingston",
    "Brooklynn",
    "Christopher",
    "Mason",
    "Andrea",
    "Aiden",
    "Avery",
    "Sara",
    "Mackenzie",
    "Jameson",
    "Vivian",
    "Kimberly",
    "Chase",
    "Jade",
    "Riley",
    "Maria",
    "Ryker",
    "Adrian",
    "Jocelyn",
    "Caleb"
];

export const Avatars = avatar.map(name => `https://api.dicebear.com/9.x/identicon/svg?seed=${name}`)