// ═══════════════════════════════════════════════════════════════
//  NEXOS – ARCHIVO DE CATEGORÍAS
//  ✏️  ESTE ES EL ÚNICO ARCHIVO QUE NECESITAS EDITAR
//
//  ESTRUCTURA:
//  · Hay 4 pools: yellow (fácil) → green → blue → purple (difícil)
//  · Cada pool tiene varias categorías.
//  · Cada categoría tiene MUCHAS palabras (mínimo 8, cuantas más mejor).
//  · Cada día el juego escoge automáticamente 4 palabras al azar
//    de cada categoría seleccionada, usando el día como semilla.
//    → Mismo día = mismas palabras para todo el mundo ✅
//
//  PARA AÑADIR UNA CATEGORÍA NUEVA:
//  · Copia un bloque existente y pégalo al final del pool correcto.
//
//  PARA AÑADIR PALABRAS A UNA CATEGORÍA EXISTENTE:
//  · Añade más strings al array words de esa categoría.
//
//  REGLAS:
//  · Palabras en MAYÚSCULAS.
//  · Mínimo 8 palabras por categoría (para que haya variedad real).
// ═══════════════════════════════════════════════════════════════

const CATEGORIAS = {

  // ════════════════════════════════════════════════════════════
  //  🟨  YELLOW  –  Fácil / directas
  // ════════════════════════════════════════════════════════════
  yellow: [

    {
      cat: "Animales marinos",
      words: [
        "TIBURÓN","PULPO","BALLENA","DELFÍN","MEDUSA","CANGREJO",
        "LANGOSTA","ERIZO","ESTRELLA","CALAMAR","MORSA","FOCA",
        "MANTARRAYA","PEZ ESPADA","BARRACUDA","CABALLITO DE MAR",
        "ORCA","TORTUGA","MANATÍ","NARVAL","PEZ LUNA","PEZ GLOBO",
        "MORENA","ANÉMONA","CORAL","GAMBA","MEJILLÓN","OSTRA",
        "ALMEJA","CACHALOTE","DUGONGO","ANGUILA","CALDERÓN",
        "PEZ PAYASO","LANGOSTINO","PERCEBE"
      ]
    },

    {
      cat: "Frutas tropicales",
      words: [
        "MANGO","PAPAYA","COCO","PIÑA","GUAYABA","LICHI",
        "MARACUYÁ","CARAMBOLA","RAMBUTÁN","TAMARINDO",
        "PITAYA","MAMEY","CHIRIMOYA","KUMQUAT",
        "MANGOSTÁN","GUANÁBANA","JACKFRUIT","DURIÁN","ZAPOTE","NONI",
        "ARAZÁ","GRANADILLA","MARANG","SALAK","PEPINO DULCE","LULO",
        "FEIJOA","CAMU CAMU","ACEROLA","FRUTA DEL PAN","JABUTICABA","BOROJÓ",
        "POMELO","CAQUI"
      ]
    },

    {
      cat: "Colores",
      words: [
        "ROJO","AZUL","VERDE","AMARILLO","NARANJA","MORADO",
        "ROSA","MARRÓN","GRIS","TURQUESA","MAGENTA","ÍNDIGO",
        "CARMESÍ","OCRE","BEIGE","LAVANDA","ESMERALDA","COBALTO",
        "CIAN","BERMELLÓN","BURDEOS","MALVA","SIENA","ÁMBAR",
        "CELESTE","LILA","SALMÓN","CREMA","MARFIL","CAQUI",
        "PISTACHO","CÁRDENO","PERLADO","ÓXIDO","BRONCE","PLATA",
        "ORO","BERENJENA"
      ]
    },

    {
      cat: "Instrumentos musicales",
      words: [
        "GUITARRA","VIOLÍN","PIANO","FLAUTA","TROMPETA","BATERÍA",
        "SAXOFÓN","ARPA","CLARINETE","OBOE","TUBA","ACORDEÓN",
        "MANDOLINA","BANJO","CELLO","CONTRABAJO","CÍTARA","XILÓFONO",
        "ARMÓNICA","ÓRGANO","LAÚD","UKELELE","PANDERO","CASTAÑUELAS",
        "GÜIRO","MARIMBA","BONGÓ","TIMBAL","SINTETIZADOR","CLAVICORDIO",
        "CORNO FRANCÉS","FAGOT","FLAUTÍN","GAITA","LIRA","OCARINA",
        "ZAMPOÑA","VIOLA"
      ]
    },

    {
      cat: "Deportes olímpicos",
      words: [
        "NATACIÓN","ATLETISMO","GIMNASIA","ESGRIMA","JUDO","BOXEO",
        "REMO","CICLISMO","VELA","TIRO","HALTEROFILIA","LUCHA",
        "TAEKWONDO","TRIATLÓN","PIRAGÜISMO","HOCKEY","VOLEIBOL",
        "BALONCESTO","TENIS","GOLF","RUGBY","FÚTBOL","BALONMANO",
        "BÁDMINTON","TENIS DE MESA","SURF","ESCALADA","SKATEBOARDING",
        "BÉISBOL","SÓFTBOL","PENTATLÓN","KÁRATE","BREAKDANCE","BMX",
        "WATERPOLO","HIPICA","TIRO CON ARCO"
      ]
    },

    {
      cat: "Verduras",
      words: [
        "ZANAHORIA","BRÓCOLI","ESPINACA","PIMIENTO","CEBOLLA","AJO",
        "LECHUGA","PEPINO","BERENJENA","COLIFLOR","CALABACÍN","ALCACHOFA",
        "PUERRO","REMOLACHA","NABO","ENDIVIA","ACELGA","CHIRIVÍA",
        "APIO","RÁBANO","COL DE BRUSELAS","ESPÁRRAGO","CALABAZA","JUDÍA VERDE",
        "GUISANTE","HINOJO","REPOLLO","KALE","BONIATO","PATATA",
        "ESCAROLA","COLINABO","MANDIOCA","YUCA","OKRA","ACEDERA",
        "CANÓNIGOS","RÚCULA"
      ]
    },

    {
      cat: "Países de América del Sur",
      words: [
        "BRASIL","ARGENTINA","CHILE","COLOMBIA","PERÚ","VENEZUELA",
        "ECUADOR","BOLIVIA","PARAGUAY","URUGUAY","GUYANA","SURINAM"
      ]
    },

    {
      cat: "Razas de perros",
      words: [
        "LABRADOR","BULLDOG","BEAGLE","CANICHE","DÁLMATA","HUSKY",
        "PASTOR ALEMÁN","BOXER","CHIHUAHUA","GALGO","DÓBERMAN","SETTER",
        "MASTÍN","COLLIE","SPITZ","BICHÓN","SAMOYEDO","AKITA",
        "GOLDEN RETRIEVER","ROTTWEILER","PULI","POMERANIA","TECKEL","BORZOI",
        "TERRANOVA","SHIBA INU","GRAN DANÉS","SAN BERNARDO","MALTÉS","SHAR PEI",
        "PUG","GALGO AFGANO","BULLDOG FRANCÉS","BULL TERRIER","CORGI","POINTER",
        "WEIMARANER","SCHNAUZER"
      ]
    },

    {
      cat: "Postres españoles",
      words: [
        "FLAN","TURRÓN","CHURROS","POLVORÓN","MANTECADO","ARROZ CON LECHE",
        "NATILLAS","TORRIJA","CREMA CATALANA","BRAZO DE GITANO",
        "BUÑUELO","ROSQUILLA","PESTIÑO","LECHE FRITA","TOCINO DE CIELO",
        "QUESADA PASIEGA","ENSAIMADA","SOBAO PASIEGO","FILLOA","GOXUA",
        "PIONONO","PANELLETS","TARTA DE SANTIAGO","SOPLILLO","BARTOLILLO",
        "PERRUNILLA","CASADIELLA","CARAJITO","SUSO","MOSTACHÓN",
        "COCA DE SAN JUAN","GAÑOTES","ALFAJOR","TORTA DE ALCÁZAR","BIENMESABE"
      ]
    },

    {
      cat: "Tipos de pan",
      words: [
        "BAGUETTE","CIABATTA","CHAPATA","HOGAZA","MOLDE","CENTENO",
        "INTEGRAL","BRIOCHE","FOCACCIA","PITA","NAAN","BAGEL",
        "PRETZEL","CROISSANT","MEDIANOCHE","BOLLO","PANECILLO",
        "PAN DE CRISTAL","PAN DE SODA","PAN DE MAÍZ","PAN DE NUECES","PAN DE OLIVAS",
        "BAO","PUMPERNICKEL","PAN DE MUERTO","HALLULLA","MARRAQUETA",
        "TELERA","BOLILLO","MICHETTA","PAIN DE CAMPAGNE","GRISSINI",
        "FOUGASSE","KULCHA","ROTI","CHAPATI"
      ]
    },

  ],

  // ════════════════════════════════════════════════════════════
  //  🟩  GREEN  –  Medio / algo más específicas
  // ════════════════════════════════════════════════════════════
  green: [

    {
      cat: "Ríos de España",
      words: [
        "EBRO","TAJO","DUERO","MIÑO","GUADALQUIVIR","SEGURA",
        "JÚCAR","TURIA","PISUERGA","GENIL","NALÓN","NERVIÓN",
        "GUADIANA","JARAMA","SIL","ARAGÓN","JALÓN","HENARES",
        "TORMES","GUADALHORCE","GUADALIMAR","TIÉTAR","ALAGÓN",
        "ZÚJAR","JABALÓN","GUADALOPE","ALBERCHE","LLOBREGAT",
        "BESÓS","MIJARES","ODIEL","TINTO","BARBATE","ANDARAX",
        "ALMANZORA","BIDASOA","DEVA","SELLA"
      ]
    },

    {
      cat: "Tipos de queso",
      words: [
        "MANCHEGO","BRIE","GOUDA","CAMEMBERT","ROQUEFORT","EDAM",
        "GRUYÈRE","PARMESANO","MOZZARELLA","CHEDDAR","FETA","RICOTTA",
        "EMMENTAL","GORGONZOLA","MASCARPONE","PROVOLONE","IDIAZÁBAL",
        "CABRALES","TETILLA","MAHÓN","BURGOS","PECORINO","STILTON",
        "REBLOCHON","RACLETTE","TALEGGIO","HAVARTI","MONTEREY JACK",
        "COLBY","OSSAU-IRATY","MAJORERO","COTIJA","HALLOUMI",
        "TILSIT","GRANA PADANO","COMTE","APPENZELLER"
      ]
    },

    {
      cat: "Pintores españoles",
      words: [
        "GOYA","PICASSO","DALÍ","VELÁZQUEZ","MURILLO","ZURBARÁN",
        "EL GRECO","RIBERA","SOROLLA","MIRÓ","TÀPIES","GRIS",
        "FORTUNY","ZULOAGA","CHILLIDA","SAURA","BARCELÓ","SOLANA",
        "BERRUGUETE","CANO","COELLO","VALDÉS LEAL","MADRAZO","ROSALES",
        "CASAS","RUSIÑOL","NONEL","ANGLADA CAMARASA","VÁZQUEZ DÍAZ",
        "PALENCIA","VIOLA","FEITO","GENOVÉS","ARROYO","MILLARES","LÓPEZ",
        "FRAILE","GORDILLO"
      ]
    },

    {
      cat: "Capitales europeas",
      words: [
        "PARÍS","ROMA","BERLÍN","ATENAS","MADRID","LISBOA",
        "VIENA","BRUSELAS","ÁMSTERDAM","VARSOVIA","BUDAPEST","PRAGA",
        "ESTOCOLMO","OSLO","HELSINKI","DUBLÍN","BUCAREST","SOFÍA",
        "COPENHAGUE","LONDRES","LUXEMBURGO","VALETTA","NICOSIA",
        "BRATISLAVA","LIUBLIANA","ZAGREB","SARAJEVO","BELGRADO",
        "SKOPJE","TIRANA","REIKIAVIK","TALLÍN","RIGA","VILNA",
        "MINSK","KIEV","CHISINÁU","MÓNACO"
      ]
    },

    {
      cat: "Escritores en español",
      words: [
        "CERVANTES","LORCA","BORGES","NERUDA","MÁRQUEZ","CORTÁZAR",
        "VARGAS LLOSA","RULFO","QUEVEDO","UNAMUNO","MACHADO",
        "CELA","DELIBES","MATUTE","ALLENDE","FUENTES","PAZ","SÁBATO",
        "BENEDETTI","MISTRAL","VALLE-INCLÁN","BÉCQUER","PÉREZ GALDÓS",
        "BAROJA","AZORÍN","ALEIXANDRE","ONETTI","BOLAÑO","GRANDES",
        "MARÍAS","MARSÉ","GOYTISOLO","PIZARNIK","STORNI","DARÍO",
        "GÜIRALDES","ZAFÓN","VÁZQUEZ-MONTALBÁN"
      ]
    },

    {
      cat: "Comunidades autónomas",
      words: [
        "CATALUÑA","ANDALUCÍA","GALICIA","ARAGÓN","ASTURIAS","CANTABRIA",
        "MURCIA","NAVARRA","LA RIOJA","EXTREMADURA","VALENCIA",
        "CANARIAS","BALEARES","MADRID","EUSKADI","CASTILLA Y LEÓN",
        "CASTILLA-LA MANCHA","CEUTA","MELILLA"
      ]
    },

    {
      cat: "Tipos de pasta italiana",
      words: [
        "ESPAGUETI","MACARRÓN","LASAÑA","TALLARÍN","PENNE","FUSILLI",
        "RIGATONI","FARFALLE","LINGUINE","TAGLIATELLE","ORECCHIETTE",
        "TORTELLINI","RAVIOLI","GNOCCHI","FETTUCCINE","VERMICELLI",
        "PAPPARDELLE","CANNELLONI","CONCHIGLIE","BUCATINI","CAVATAPPI",
        "GEMELLI","RADIATORI","MAFALDINE","PACCHERI","STELLINE",
        "DITALINI","ROTINI","CAPPELLETTI","AGNOLOTTI","MEZZELUNE",
        "CASARECCE","CAMPANELLE","STROZZAPRETI","BIGOLI","TROFIE"
      ]
    },

    {
      cat: "Bailes y danzas",
      words: [
        "TANGO","FLAMENCO","SALSA","VALS","POLKA","MAMBO",
        "BOLERO","CHA CHA","FOXTROT","SWING","BALLET","JOTA",
        "SEVILLANA","PASODOBLE","MERENGUE","CUMBIA","BACHATA","RUMBA",
        "SAMBA","BOSSA NOVA","KIZOMBA","ZUMBA","HIP HOP","BREAKDANCE",
        "CLAQUÉ","CHARLESTON","DANZA DEL VIENTRE","SARDANA","AURRESKU",
        "MUIÑEIRA","CHACARERA","MALAMBO","GAVOTA","MINUÉ","QUADRILLE",
        "TWIST"
      ]
    },

    {
      cat: "Platos españoles",
      words: [
        "GAZPACHO","PAELLA","TORTILLA","CROQUETA","FABADA","COCIDO",
        "PISTO","SALMOREJO","PULPO A FEIRA","CALÇOTS","ESCUDELLA",
        "MIGAS","PAPAS ARRUGADAS","MARMITAKO","PINTXOS","LACÓN",
        "COCHINILLO","LECHAZO","TORREZNOS","GACHAS","AJOARRIERO",
        "FRITURA MALAGUEÑA","ENSALADILLA RUSA","GAMBAS AL AJILLO",
        "CHIPIRONES","CALLOS","POTE ASTURIANO","SOBRASADA","CHISTORRA",
        "COCIDO MONTAÑÉS","TRUCHA A LA NAVARRA","BACALAO AL PIL PIL",
        "MERLUZA A LA KOSKERA","RABO DE TORO","FLAMENQUÍN","TERNASCO"
      ]
    },

    {
      cat: "Tipos de café",
      words: [
        "ESPRESSO","CAPPUCCINO","AMERICANO","LATTE","CORTADO","BOMBÓN",
        "CARAJILLO","CAFÉ CON LECHE","MARRÓN","MANCHADO","IRLANDÉS",
        "VIENÉS","FRAPPÉ","COLD BREW","AFFOGATO","LUNGO",
        "MACCHIATO","RISTRETTO","FLAT WHITE","MOCHA","TURCO","GRIEGO",
        "ASIÁTICO","BELMONTE","BARRAQUITO","MAZAGRÁN","RED EYE","DOPPIO",
        "SHAKERATO","CORRETTO","PICCOLO","BREVE","NITRO","CAFÉ DE OLLA",
        "VIETNAMITA","FRAPPUCCINO"
      ]
    },

  ],

  // ════════════════════════════════════════════════════════════
  //  🟦  BLUE  –  Difícil / más especializadas
  // ════════════════════════════════════════════════════════════
  blue: [

    {
      cat: "Elementos químicos",
      words: [
        "OXÍGENO","HIDRÓGENO","CARBONO","NITRÓGENO","HELIO","NEÓN",
        "SODIO","CLORO","CALCIO","HIERRO","COBRE","ZINC",
        "PLATA","ORO","PLATINO","MERCURIO","URANIO","FÓSFORO",
        "AZUFRE","POTASIO","MAGNESIO","ALUMINIO","SILICIO","ARSÉNICO",
        "BROMO","KRIPTÓN","XENÓN","RADÓN","LITIO","BERILIO",
        "BORO","FLÚOR","TITANIO","CROMO","MANGANESO","COBALTO",
        "NÍQUEL","PLOMO"
      ]
    },

    {
      cat: "Faraones del Antiguo Egipto",
      words: [
        "RAMSÉS","TUTANKAMÓN","CLEOPATRA","NEFERTITI","AMENOFIS",
        "THUTMOSIS","HATSHEPSUT","AKHENATON","SETI","KEOPS",
        "MENKAURE","SNEFRU","ZOSER","AHMOSIS","NARMER",
        "KHEFRÉN","DJEDEFRA","PEPI II","USERKAF","SAHURA",
        "NEFERERKARA","AMENEMHAT I","SENUSERT I","TUTMOSIS IV",
        "AMENHOTEP II","AY","HOREMHEB","MERENPTAH","RAMSÉS III",
        "RAMSÉS IX","PSIKHEOPS","NECO II","PTOLEMEO I","CESARIÓN",
        "DEN"
      ]
    },

    {
      cat: "Huesos del cuerpo humano",
      words: [
        "FÉMUR","TIBIA","PERONÉ","HÚMERO","RADIO","CÚBITO",
        "CLAVÍCULA","ESCÁPULA","COSTILLA","VÉRTEBRA","RÓTULA",
        "ESTERNÓN","MANDÍBULA","OCCIPITAL","PARIETAL","SACRO","ATLAS",
        "CÓCCIX","ETMOIDES","ESFENOIDES","TEMPORAL","MAXILAR",
        "CIGOMÁTICO","NASAL","VÓMER","ESTRIBO","YUNQUE",
        "MARTILLO","AXIS","HIOIDES","CARPO","METACARPO",
        "FALANGE","TARSO","METATARSO","ILION","ISQUION"
      ]
    },

    {
      cat: "Términos musicales italianos",
      words: [
        "FORTE","PIANO","ALLEGRO","ANDANTE","ADAGIO","PRESTO",
        "LEGATO","STACCATO","CRESCENDO","FERMATA","VIBRATO","PIZZICATO",
        "FORTISSIMO","PIANISSIMO","MODERATO","VIVACE","GRAVE","SOPRANO",
        "ARPEGGIO","TENUTO","GLISSANDO","DIMINUENDO","RALLENTANDO",
        "ACCELERANDO","MEZZO FORTE","MEZZO PIANO","SOLO","TUTTI",
        "CODA","DAL SEGNO","DA CAPO","LARGO","LARGHETTO",
        "RUBATO","CON BRIO","AGITATO","DOLCE","CANTABILE"
      ]
    },

    {
      cat: "Movimientos artísticos",
      words: [
        "IMPRESIONISMO","CUBISMO","SURREALISMO","DADAÍSMO","BARROCO",
        "RENACIMIENTO","ROMANTICISMO","EXPRESIONISMO","FUTURISMO",
        "MINIMALISMO","NEOCLASICISMO","MODERNISMO","SIMBOLISMO","FAUVISMO",
        "REALISMO","NATURALISMO","ROCOCÓ","MANIERISMO","GÓTICO",
        "ROMÁNICO","POP ART","SUPREMATISMO","CONSTRUCTIVISMO","OP ART",
        "ARTE POVERA","LAND ART","FLUXUS","PUNTILLISMO","PRERRAFAELISMO",
        "POSTIMPRESIONISMO","ART NOUVEAU","ART DÉCO","HIPERREALISMO","ABSTRACCIÓN"
      ]
    },

    {
      cat: "Figuras retóricas",
      words: [
        "METÁFORA","HIPÉRBOLE","METONIMIA","IRONÍA","ANÁFORA",
        "SÍMIL","ANTÍTESIS","PERSONIFICACIÓN","ALITERACIÓN","OXÍMORON",
        "SINÉCDOQUE","EUFEMISMO","ELIPSIS","ASÍNDETON","POLISÍNDETON",
        "PARADOJA","PLEONASMO","HIPÉRBATON","ONOMATOPEYA","EPÍTETO",
        "RETRUÉCANO","SINÉRESIS","DIÉRESIS","ENCABALGAMIENTO","PARANOMASIA",
        "POLÍPTOTON","APÓSTROFE","CALAMBUR","QUIASMO","LÍTOTE",
        "TOPOGRAFÍA","PROSOPOGRAFÍA","CRONOGRAFÍA","PARALELISMO","SINESTESIA"
      ]
    },

    {
      cat: "Filósofos de la Antigua Grecia",
      words: [
        "SÓCRATES","PLATÓN","ARISTÓTELES","HERÁCLITO","PITÁGORAS",
        "PARMÉNIDES","ANAXÁGORAS","DEMÓCRITO","EPICURO","ZENÓN",
        "DIÓGENES","TALES","ANAXIMANDRO","EMPÉDOCLES","PROTÁGORAS",
        "JENÓFANES","LEUCIPO","ANTÍSTENES","CRISIPO","PIRRÓN",
        "ARQUÍMEDES","EUCLIDES","GORGIAS","CRITIAS","ARISTIPO",
        "JENOFONTE","PLUTARCO","TEÓFRASTO","ARISTARCO","POSIDONIO",
        "PLOTINO","PORFIRIO","HIPATIA","JÁMBLICO","EPICARMO"
      ]
    },

    {
      cat: "Planetas y lunas famosas",
      words: [
        "MARTE","VENUS","JÚPITER","SATURNO","URANO","NEPTUNO",
        "TITÁN","EUROPA","GANÍMEDES","IO","CALISTO","FOBOS",
        "DEIMOS","TRITÓN","CARONTE","ENCÉLADO",
        "MERCURIO","TIERRA","LUNA","PLUTÓN","ERIS","HAUMEA",
        "MAKEMAKE","CERES","MIMAS","TETIS","DIONE","REA",
        "JÁPETO","FEBE","MIRANDA","ARIEL","UMBRIEL","TITANIA",
        "OBERÓN","PROTEO"
      ]
    },

  ],

  // ════════════════════════════════════════════════════════════
  //  🟪  PURPLE  –  Trampa / palabra que va delante o detrás
  // ════════════════════════════════════════════════════════════
  purple: [

    {
      cat: "MEDIA/O ___",
      words: [
        "LUNA","NOCHE","NARANJA","TARDE","VIDA","HORA",
        "PENSIÓN","TEMPORADA","DISTANCIA","TIEMPO","VUELTA"
      ]
    },

    {
      cat: "___ ROJO/A",
      words: [
        "CAPERUCITA","PLANETA","SEMÁFORO","ALARMA","TARJETA","ZONA",
        "LÍNEA","MAR","CRUZ","SANGRE","LABIOS","BODA"
      ]
    },

    {
      cat: "EXTRA___",
      words: [
        "ORDINARIO","TERRESTRE","VAGANTE","ESCOLAR","JUDICIAL",
        "OFICIAL","CONTINENTAL","SENSORIAL","TERRITORIAL","CURRICULAR"
      ]
    },

    {
      cat: "___ VERDE",
      words: [
        "CHISTE","ZONA","SEMÁFORO","CAMPO",
        "TÉ","MONSTRUO","GUISANTE","PIMIENTO","GIGANTE","MOCO"
      ]
    },

    {
      cat: "___ NEGRO/A",
      words: [
        "MERCADO","OVEJA","CAJA","HUMOR","LISTA","MAREA",
        "NOCHE","AGUJERO","MAGIA","MAMBA","PANTERA","VIERNES"
      ]
    },

    {
      cat: "___ LIBRE",
      words: [
        "TIEMPO","DÍA","TIRO","CAÍDA","COMERCIO","ALBEDRÍO",
        "PRENSA","PENSAMIENTO","MERCADO","ESTILO","ZONA","VERSO"
      ]
    },

    {
      cat: "___ NACIONAL",
      words: [
        "PARQUE","HIMNO","EQUIPO","FIESTA","POLICÍA","GUARDIA",
        "PALACIO","MUSEO","BIBLIOTECA","ARCHIVO","MONUMENTO","ACADEMIA"
      ]
    },

    {
      cat: "___ ELÉCTRICO/A",
      words: [
        "TREN","GUITARRA","ANGUILA","COCHE","PATINETE","PIANO",
        "SILLA","MANTA","VENTILADOR","CADENA","CORRIENTE","TORMENTA"
      ]
    },

    {
      cat: "SUPER___",
      words: [
        "HÉROE","MERCADO","HOMBRE","MUJER","NATURAL","DOTADO",
        "FICIAL","POSICIÓN","VIVIENTE","ESTRELLA","CAMPEÓN","PODER"
      ]
    },

    {
      cat: "___ BLANCO/A",
      words: [
        "NOCHE","BANDERA","VINO","NAVIDAD","NIEVE","PALOMA",
        "PÁGINA","LIENZO","CHEQUE","ARMA","BODA","CASA"
      ]
    },

  ],

};
