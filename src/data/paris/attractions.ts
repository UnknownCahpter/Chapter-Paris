import type { AttractionData } from '../../config/trip.types';

export const attractionData: Record<string, AttractionData> = {
    'Arrival at Gare du Nord, followed by check-in': {
        desc: 'A soft landing into Paris: arrive at Gare du Nord, regroup, and head to check-in before the city asks anything more of the day.',
        tips: 'Keep the first window light. Drop bags, refresh, and let the afternoon begin gently rather than trying to conquer too much on arrival day.',
    },
    'Tea at Jugetsudo by Maruyama Nori': {
        desc: 'Jugetsudo by Maruyama Nori is the brand’s only overseas tea house, known for Japanese matcha, green tea, and a quietly refined tea-room atmosphere just off the Seine.',
        tips: 'Best picks here are the genmaicha set or hojicha set with wagashi. If you want the full experience, the Cha-Zen matcha ceremony in the basement can be booked ahead.',
    },
    'A leisurely stroll through the Jardin du Luxembourg': {
        desc: 'The Jardin du Luxembourg is a royal garden shaped by Marie de Médicis in 1612 and still one of the most graceful places to ease into Paris. The basin, the movable green chairs, the Medici Fountain, and the palace backdrop make it feel both grand and deeply livable.',
        tips: 'This stop works best as a decompression ritual rather than a checklist. Sit by the basin, walk to the quieter Medici Fountain, and let this be the true arrival moment after the flight. Best before mid-afternoon if you want a calmer garden.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Fountain_%40_Jardin_du_Luxembourg_%40_Paris_%2830623667325%29.jpg/1280px-Fountain_%40_Jardin_du_Luxembourg_%40_Paris_%2830623667325%29.jpg',
        imagePosition: 'center 54%',
        funFacts: [
            'Commissioned in 1612 by Marie de Médicis, inspired by the Boboli Gardens of Florence.',
            'The Medici Fountain is one of Paris’s best-preserved seventeenth-century fountains.',
            'Victor Hugo placed the first meeting of Marius and Cosette here in Les Misérables.',
        ],
    },
    'Optional time to explore the Little Japan quarter around Rue Sainte-Anne': {
        desc: 'Rue Sainte-Anne and the surrounding lanes form Paris’s best-known Little Japan pocket, full of ramen shops, matcha stops, and Japanese groceries.',
        tips: 'Keep it flexible. If everyone still has energy, this is a fun low-stakes wander before dinner.',
    },
    'Dinner at Pho 14 Opéra': {
        desc: 'PHO 14 Opéra is a long-running Vietnamese favourite in the Opéra area, known for slow-simmered beef broth, crisp spring rolls, and a practical no-reservation format that works well on arrival night.',
        tips: 'Best orders are the beef pho and crispy nems. It stays open late, is easy on energy, and suits a first evening when no one wants to over-plan.',
    },
    "Visit Marché Couvert Beauvau and Marché d'Aligre": {
        desc: "Marché Beauvau and Marché d'Aligre together form one of Paris’s most authentic market districts: a historic covered hall for cheese, charcuterie, and specialist stalls, plus a lively outdoor market layered with produce, bargain hunting, and local noise.",
        tips: "If you visit only one Paris market, this is one of the strongest choices. Go in the morning for the best produce and atmosphere, point rather than overthink your French, and treat the whole square as part food stop, part people-watching ritual.",
        image: '/attractions/marche-daligre.jpg',
        imagePosition: 'center 52%',
        funFacts: [
            "The square dates back to 1779 and was later expanded into the market district you see today.",
            'The covered hall still contains a working nineteenth-century fountain.',
            "Some stalls at Marché d'Aligre have stayed in the same families for generations.",
        ],
    },
    'Photo stop at Rue Crémieux': {
        desc: 'Rue Crémieux is a pastel-painted residential street whose appeal is simple: colour, symmetry, and a slightly unreal calm in the middle of Paris. It is easy to fold into the Aligre morning without turning it into a major detour.',
        tips: 'Go early if possible and keep the stop brief and respectful. It is still a lived-in street, and it works best as a quick photo pause rather than a destination that needs much more than fifteen minutes.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Rue_Cr%C3%A9mieux%2C_Paris_30_June_2012_-_panoramio.jpg',
        imagePosition: 'center 54%',
        funFacts: [
            'The pastel facades are not original; residents repainted them in the 1990s.',
            'The street still carries a visible marker from the 1910 Seine flood.',
            'Its quiet beauty is effectively a by-product of a residents’ renovation compromise, not a tourist design project.',
        ],
    },
    'Lunch at Bistro S or TOWA Restaurant': {
        desc: 'Both are serious French-Japanese lunch options in the 12th arrondissement. Bistro S is the sharper bistronomique pick, with chef Shimpei Oié’s more polished cooking and a Michelin Guide mention; TOWA feels more market-led, with daily shifts shaped by nearby Aligre produce.',
        tips: "Choose Bistro S if you want the more refined, reservation-worthy lunch. Choose TOWA if you want something slightly more relaxed and local. At Bistro S, the beef tartare and Paris-Brest are the standout orders; at TOWA, look for the cod with yuzu beurre blanc and yuzu vacherin.",
        options: [
            {
                label: 'Lunch Pick',
                venueName: 'Bistro S',
                category: 'French-Japanese fusion',
                isMarcosPick: true,
            },
            {
                label: 'Alternative',
                venueName: 'TOWA Restaurant',
                category: 'French-Japanese fusion',
            },
        ],
        optionNote: 'Both are in the 12th arrondissement and keep the afternoon route easy.',
    },
    'A stroll along Canal Saint-Martin, followed by time to explore Rue Beaurepaire': {
        desc: 'Canal Saint-Martin shows a more local, less polished side of Paris: iron footbridges, plane trees, lock gates, and a stretch of water that slices quietly through the 10th arrondissement. Today it is one of the easiest places in Paris to slow down without needing a plan.',
        tips: 'This stop is best treated as a drift. Walk Quai de Valmy, pause for a coffee, then browse Rue Beaurepaire’s smaller shops. Late afternoon is especially good here, when the light softens and the whole area feels lived-in rather than staged.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Canal_Saint-Martin_%40_Paris_%2828339618884%29.jpg/1280px-Canal_Saint-Martin_%40_Paris_%2828339618884%29.jpg',
        imagePosition: 'center 58%',
        funFacts: [
            'Napoleon ordered the canal built in 1802 to improve Paris’s water supply.',
            'It nearly became a highway in the 1960s before being saved.',
            'Films from L’Atalante to Amélie have used the canal as a Paris setting.',
        ],
    },
    'Return to the hotel for a short rest': {
        desc: 'A deliberate pause before the evening. Going back to reset helps the day feel generous rather than overloaded.',
        tips: 'Keep it truly short so dinner still feels like a fresh second act.',
    },
    'Visit Le Bon Marché': {
        desc: 'Le Bon Marché is not just a luxury department store; it is one of the places where modern retail was invented. Fixed prices, returns, mail-order catalogues, and the elegant ironwork overhead all belong to its story, and the building still carries that sense of Parisian commercial theatre.',
        tips: 'Even without serious shopping plans, it is worth coming for the architecture and atmosphere alone. Look up at the iron structure linked to Gustave Eiffel, then continue straight to La Grande Épicerie, which is arguably the real reward of this stop.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Paris_-_Le_Bon_March%C3%A9_%2831885711304%29.jpg/1280px-Paris_-_Le_Bon_March%C3%A9_%2831885711304%29.jpg',
        imagePosition: 'center 62%',
        funFacts: [
            'It helped popularize fixed pricing and unconditional returns in retail.',
            'Its expansion involved ironwork associated with Gustave Eiffel.',
            'Zola used Le Bon Marché as a model for Au Bonheur des Dames.',
        ],
    },
    'Dinner at Baillotte or La Jacobine': {
        desc: 'These two options give you very different Saint-Germain dinner moods. Baillotte is the more technical French-Japanese choice, with chef Satoshi Amitsu’s small-room bistronomy and a stronger sense of craft. La Jacobine is the classic bistro answer: onion soup, duck confit, warm lighting, and a reliable Left Bank atmosphere.',
        tips: 'Pick Baillotte if you want a meal that feels more chef-driven and reservation-worthy. Pick La Jacobine if the group wants a lower-risk, classic Paris dinner where the room and the street outside are part of the pleasure.',
        options: [
            {
                label: 'Option A',
                venueName: 'Baillotte',
                category: 'French-Japanese fusion',
            },
            {
                label: 'Option B',
                venueName: 'La Jacobine',
                category: 'Classic Paris bistro',
            },
        ],
        optionNote: 'Both are in the 6th arrondissement, so the evening stays compact after Le Bon Marché.',
    },
    'Visit the Panthéon': {
        desc: 'The Panthéon is where revolutionary Paris, Enlightenment ideals, and national memory all converge. Beneath the great neoclassical dome lie figures such as Voltaire, Rousseau, Victor Hugo, and Marie Curie, which gives the building a weight that goes far beyond its architecture.',
        tips: 'Give the crypt and Foucault pendulum proper time rather than treating this as a quick exterior stop. The dome line is impressive from outside, but the real value is understanding how the building shifted from church to secular mausoleum and why it still matters in the French imagination.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Pantheon_of_Paris_007.JPG/1280px-Pantheon_of_Paris_007.JPG',
        imagePosition: 'center 58%',
        funFacts: [
            'The Panthéon changed several times between church and secular monument before settling into its current national role.',
            'Foucault used the building in 1851 to demonstrate that the Earth rotates.',
            'Marie Curie remains the only woman interred there for her own achievements.',
        ],
    },
    'Continue to Notre-Dame': {
        desc: 'Notre-Dame remains one of the defining monuments of Paris because so many layers of the city meet here at once: Gothic ambition, royal ritual, revolution, literature, the 2019 fire, and the enormous restoration that followed. Even after centuries of upheaval, it still feels like the emotional center of historic Paris.',
        tips: 'The reopened interior and stained glass are the real reward, so book a time slot if you want to reduce waiting. If the queue is too long, the exterior, the west façade, and the setting on the Île de la Cité still make the stop worthwhile.',
        image: '/attractions/notre-dame-2025.jpg',
        imagePosition: 'center 54%',
        funFacts: [
            'Construction began in the twelfth century and continued for roughly two hundred years.',
            'Notre-Dame reopened in December 2024 after the 2019 fire.',
            'Victor Hugo helped revive public affection for the cathedral through his 1831 novel.',
        ],
    },
    'Board the Bateaux-Mouches river cruise': {
        desc: 'Bateaux-Mouches is a classic Seine cruise for a reason: from the water, Paris reads differently. Notre-Dame’s side profile, the rhythm of the bridges, and the changing distance to the Eiffel Tower all feel more legible from the river than from the street.',
        tips: 'This is one of the easiest transitions in the itinerary because the boat carries you. If weather allows, aim for the open upper deck. The company departs from Pont de l’Alma and the full loop takes around seventy minutes.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Bateaux_Mouches%2C_Paris_%2815054976301%29.jpg/1280px-Bateaux_Mouches%2C_Paris_%2815054976301%29.jpg',
        imagePosition: 'center 56%',
    },
    'Free time for lunch': {
        desc: 'A rare open pocket in the itinerary, giving everyone room to follow appetite, mood, and energy level.',
        tips: 'Keep lunch close to the day’s route so the afternoon still feels leisurely.',
    },
    'Enjoy a leisurely afternoon in Saint-Germain, with visits to Citypharma, La Grande Épicerie, and Des Gâteaux et du Pain': {
        desc: 'This Saint-Germain stretch is half practical, half indulgent. Citypharma covers the efficient beauty-and-pharmacy run; La Grande Épicerie is one of Paris’s best gourmet shopping addresses; and Des Gâteaux et du Pain adds Claire Damon’s more exacting pastry work to the afternoon.',
        tips: 'At La Grande Épicerie, focus on cheese, chocolate, and French pantry souvenirs unless you want to lose an hour immediately. At Des Gâteaux et du Pain, chef Claire Damon was named France’s best pastry chef in 2018, and her creations center on seasonal organic fruit. Citypharma is one of Paris’s best-known pharmacy and French beauty-shopping stops, so it is the practical skincare and wellness errand in between.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Place_Saint-Germain-des-Pr%C3%A9s_4.jpg/1280px-Place_Saint-Germain-des-Pr%C3%A9s_4.jpg',
        imagePosition: 'center 56%',
    },
    'Check in to the Airbnb': {
        desc: 'A practical mid-trip reset: moving into Mouffetard shifts the trip into a more lived-in neighbourhood rhythm.',
        tips: 'Once bags are dropped, the 5th arrondissement becomes your easy evening radius.',
    },
    'Visit G. Detou': {
        desc: 'G. Detou feels less like a boutique and more like a trade supplier that accidentally stayed open to the public. That is exactly the charm: shelves of Valrhona chocolate, candied fruit, praliné, and baking ingredients without any attempt to style the place for tourists.',
        tips: 'Go here for things that are genuinely worth carrying home: loose Valrhona chocolate, candied fruit, praliné, and pastry ingredients. The packaging is plain, but the quality is serious, and that is what makes the stop memorable.',
    },
    'Dinner at Maslow 1er or Daimant Saint-Honoré': {
        desc: 'These are two of the strongest plant-forward dinner options in central Paris without any sense of compromise. Maslow 1er is the more energetic, river-facing choice, with a menu built around smaller plates designed for sharing. Daimant Saint-Honoré leans moodier and more evening-coded, centering vegetables cooked over charcoal and grill, paired with darker plant-based jus and a bigger, more structured menu.',
        tips: 'Pick Maslow if you want the easiest group dinner and a small-plates format that works well for sharing. Pick Daimant if you want a fuller dinner built around fire-cooked vegetables, deeper sauces, and a more substantial menu.',
        options: [
            {
                label: 'Option A',
                venueName: 'Maslow 1er',
                category: 'Vegetarian',
            },
            {
                label: 'Option B',
                venueName: 'Daimant Saint-Honoré',
                category: 'Vegetarian French',
            },
        ],
        optionNote: 'Both are vegetarian-friendly options in central Paris.',
    },
    'Versailles Cut-the-Queue Tour': {
        desc: 'Versailles is the one day in the itinerary that is meant to feel imperial in scale. The palace, Hall of Mirrors, formal gardens, and sheer size of the site are impossible to understand properly through photos alone, which is why the full-day slot makes sense.',
        tips: 'Comfortable shoes matter more than almost anything else here. The tour already solves the main logistics, so save your energy for the Hall of Mirrors, the formal gardens, and simply absorbing the scale rather than racing through every corner. If you decide to go by RER instead, remember to buy a separate ticket that covers Zone 3 rather than relying on a regular central-Paris Metro ticket.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Versailles-Chateau-Jardins02.jpg/1280px-Versailles-Chateau-Jardins02.jpg',
        imagePosition: 'center 58%',
    },
    'A relaxed dinner at home or at a nearby walk-in restaurant': {
        desc: 'After Versailles, the right move is to keep dinner close, easy, and low-decision. Le Petit Bal Perdu is the more established neighbourhood bistro choice; Narro is the newer French-bistro alternative near the Airbnb.',
        tips: 'Le Petit Bal Perdu is especially easy after a long day, with a local feel and a short walk home. Narro stays on the same practical logic: close, good, and not demanding much more planning energy.',
        options: [
            {
                label: 'Option A',
                venueName: 'Le Petit Bal Perdu',
                category: 'French',
            },
            {
                label: 'Option B',
                venueName: 'narro',
                title: 'Narro',
                category: 'French bistro',
            },
        ],
        optionNote: 'Both are easy dinner options near the Airbnb.',
    },
    'Visit Champ de Mars, Pont de Bir-Hakeim, and Esplanade Joseph-Wresinski': {
        desc: 'This morning is built around the Eiffel Tower’s most rewarding public viewpoints rather than another formal attraction. Champ de Mars gives the cleanest full-frontal read of the tower from a broad lawn that once served as the military training ground of the Ecole Militaire. Pont de Bir-Hakeim adds the more cinematic perspective: a historic two-level bridge whose upper deck carries Metro Line 6 and whose frame creates one of Paris’s most recognizable Eiffel Tower views. Esplanade Joseph-Wresinski completes the sequence with another strong angle along the river.',
        tips: 'Early morning is best, ideally before the main crowds arrive, because the light is gentler and the viewpoints feel calmer. Start around Champ de Mars for the clean, open composition, then walk to Bir-Hakeim for the bridge view and the path down toward the Seine. If you want an extra detour, continue toward Île aux Cygnes, where the small Statue of Liberty replica adds one more memorable Paris detail.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Pont_de_Bir-Hakeim%2C_vue_de_la_Tour_Eiffel.jpg/1280px-Pont_de_Bir-Hakeim%2C_vue_de_la_Tour_Eiffel.jpg',
        imagePosition: 'center 60%',
        funFacts: [
            'Champ de Mars takes its name from the Roman Campus Martius and originally served as the training ground for the nearby military school.',
            'In 1783, Jacques Charles and the Robert brothers launched the world’s first hydrogen balloon from Champ de Mars.',
            'Bir-Hakeim Bridge was built from 1903 to 1905 and renamed in 1948 to honor the 1942 Battle of Bir Hakeim, a key Free French stand in North Africa.',
            'The upper level of Bir-Hakeim carries Metro Line 6, whose crossing here is one of the city’s most cinematic everyday views.',
            'Scenes from Inception were filmed on Bir-Hakeim, which helped cement its reputation as one of Paris’s most filmic bridges.',
        ],
    },
    'Photo stop at the Arc de Triomphe (exterior only)': {
        desc: 'The Arc de Triomphe is worth this short exterior pause because its scale and sculptural detail are far more affecting in person than in passing photographs. Even without going up, it still carries the full force of Napoleonic ambition, war memory, and Parisian urban theatre.',
        tips: 'Treat this as a focused exterior stop. Walk close enough to see the relief sculptures, especially La Marseillaise, then keep the day moving. If you ever wanted to return for the rooftop, sunset or evening would be the best time.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Arc_de_Triomphe%2C_Paris_21_October_2010.jpg/1280px-Arc_de_Triomphe%2C_Paris_21_October_2010.jpg',
        imagePosition: 'center 52%',
    },
    'Lunch at Enni Udon': {
        desc: 'Enni Udon is a casual Japanese noodle stop near the Champs-Élysées, known for hand-made udon and broths built from dried fish, kombu, and shiitake rather than a generic quick-lunch formula. A few Japanese food blogs have singled it out as one of the rare udon spots outside Japan genuinely worth seeking out.',
        tips: 'The strongest choices here are the signature Enni Udon bowl with minced pork, burdock, konjac, daikon, and a sake-lees broth, the tempura udon, and the karaage, which reviewers often treat as the must-order side. It also works well at this point in the day because it is easy, well-rated, and still friendly for anyone looking for a vegetarian option.',
    },
    'Stroll along the Champs-Élysées': {
        desc: 'One of the city’s iconic promenades, best enjoyed without trying to force too much meaning onto it.',
        tips: 'Walk it, dip into a few stores if you want, and let the avenue be the connector to the next part of the day.',
    },
    'Explore and shop in Le Marais': {
        desc: 'Le Marais is one of the easiest Paris neighbourhoods to enjoy without a script: fashion, vintage clothing, sweets, old stone streets, galleries, and street life all sit close together, so wandering actually works as a plan rather than a fallback.',
        tips: 'Keep this part loose on purpose. The neighbourhood rewards side streets, casual detours, and short shop stops more than a checklist, especially if you want to browse vintage clothing along the way. Rue des Rosiers, Saint-Paul, and the lanes around them are where the area feels most alive.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Rue_des_Rosiers%2C_Paris%2C_France_01.jpg/1280px-Rue_des_Rosiers%2C_Paris%2C_France_01.jpg',
        imagePosition: 'center 54%',
    },
    "Tea at Les Trois Chocolats or Brigat'": {
        desc: "These are two very different sweet stops in the Marais. Les Trois Chocolats is the more distinctive Japanese-French chocolate address, with yuzu, matcha, and sansho flavours that are difficult to find elsewhere in Paris. Brigat’ is the bakery-pastry answer, stronger if the mood leans toward laminated pastry, focaccia, or something more casual.",
        tips: "Choose Les Trois Chocolats if you want the more singular stop, especially for the chou chou, strawberry mochi, and Japanese-style bonbons. Choose Brigat’ if you want pastry rather than confectionery, especially the croissant pissaladière or panettone.",
        options: [
            {
                label: 'Tea Pick',
                venueName: 'Les Trois Chocolats',
                category: 'Japanese-French chocolate',
                isMarcosPick: true,
            },
            {
                label: 'Alternative',
                venueName: "Brigat'",
                category: 'Pastry and dessert',
            },
        ],
        optionNote: 'Both are easy to fold into a Marais stroll.',
    },
    'Dinner options in Le Marais': {
        desc: 'This final Marais dinner slot gives you three genuinely different endings to the day: Les Enfants Rouges for a more established French-Japanese bistro, Bombance for contemporary French bistronomy, or Le Potager du Marais for a classic French menu rethought in vegetarian and vegan form.',
        tips: 'Pick Les Enfants Rouges if you want the neighbourhood classic with Japanese logic under a French surface. Pick Bombance for the most purely French, chef-driven dinner. Pick Le Potager du Marais if vegetarian needs are the priority and you still want recognisably French dishes rather than a compromise option.',
        options: [
            {
                label: 'Option A',
                venueName: 'Les Enfants Rouges',
                category: 'French-Japanese fusion',
            },
            {
                label: 'Option B',
                venueName: 'Bombance',
                category: 'French',
            },
            {
                label: 'Option C',
                venueName: 'Le Potager du Marais',
                category: 'Vegetarian',
            },
        ],
        optionNote: 'Le Potager du Marais is the vegetarian option.',
    },
    'Check out and store luggage before sightseeing': {
        desc: 'A practical final-day move that protects the last morning from feeling rushed.',
        tips: 'Suggested storage near Notre-Dame: LOCK & enjoy! at 14 Rue des Bernardins, or CITY-LOCKER at 6 Rue des Bernardins.',
    },
    'Last-minute souvenir shopping in Saint-Germain': {
        desc: 'Saint-Germain is a sensible final shopping district because it still feels beautiful at low speed. Books, pantry gifts, pharmacy buys, pastries, and smaller boutiques all fit naturally here without turning the last morning into a frantic haul.',
        tips: 'Keep this final loop selective. The point is not to maximise shopping; it is to leave Paris with one last good neighbourhood atmosphere and enough time to retrieve luggage and depart without stress.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Place_Saint-Germain-des-Pr%C3%A9s_4.jpg/1280px-Place_Saint-Germain-des-Pr%C3%A9s_4.jpg',
        imagePosition: 'center 56%',
    },
    'Departure by Eurostar or onward flight': {
        desc: 'The trip closes the way it began: together, with bags repacked, a few final purchases, and just enough time left to feel the city receding.',
        tips: 'Aim to leave earlier than you think you need, especially if luggage retrieval and station queues are involved.',
    },
};
