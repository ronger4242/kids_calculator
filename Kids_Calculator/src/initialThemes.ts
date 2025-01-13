export interface Theme {
  name: string;
  url: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
}

export const initialThemes: Theme[] = [
  {
    name: "Space Adventure",
    url: "https://raw.githubusercontent.com/ronger4242/kids_calculator/main/themes/Leonardo_Phoenix_10_Prompt_Cute_space_theme_with_friendly_plan_1.jpg",
    colors: {
      primary: '#3B82F6',
      secondary: '#22C55E',
      accent: '#EAB308',
      text: '#FFFFFF'
    }
  },
  {
    name: "Ocean Friends",
    url: "https://raw.githubusercontent.com/ronger4242/kids_calculator/main/themes/Leonardo_Phoenix_10_Prompt_Cheerful_underwater_scene_with_frie_0%20(1).jpg",
    colors: {
      primary: '#00BCD4',
      secondary: '#48D1CC',
      accent: '#20B2AA',
      text: '#FFFFFF'
    }
  },
  {
    name: "Enchanted Forest",
    url: "https://raw.githubusercontent.com/ronger4242/kids_calculator/main/themes/Leonardo_Phoenix_10_Prompt_Cute_woodland_animals_gathered_in_a_1.jpg",
    colors: {
      primary: '#4CAF50',
      secondary: '#8BC34A',
      accent: '#795548',
      text: '#FFFFFF'
    }
  },
  {
    name: "Fairy Tale",
    url: "https://raw.githubusercontent.com/ronger4242/kids_calculator/main/themes/Leonardo_Phoenix_10_Prompt_Whimsical_fairy_tale_scene_with_ado_1.jpg",
    colors: {
      primary: '#FF69B4',
      secondary: '#FFD700',
      accent: '#DDA0DD',
      text: '#FFFFFF'
    }
  },
  {
    name: "Happy Vehicles",
    url: "https://raw.githubusercontent.com/ronger4242/kids_calculator/main/themes/Leonardo_Phoenix_10_Prompt_Adorable_anthropomorphic_vehicles_p_1.jpg",
    colors: {
      primary: '#F44336',
      secondary: '#2196F3',
      accent: '#FFC107',
      text: '#FFFFFF'
    }
  },
  {
    name: "Kawaii Cars",
    url: "https://raw.githubusercontent.com/ronger4242/kids_calculator/main/themes/Leonardo_Phoenix_10_Prompt_Kawaiistyle_cartoon_vehicles_with_c_1.jpg",
    colors: {
      primary: '#FFB6C1',
      secondary: '#87CEEB',
      accent: '#DDA0DD',
      text: '#FFFFFF'
    }
  }
];