exports.responses = {
  INIT: "these are my firsts steps",
  SEE_A_OBJECT_FROM_INVENTORY: "... me parecía útil y me lo guardé",
  GET_OBJECT: "me la guardaré, puede ser útil más adelante",
  UNKNOWN_PLACE_TO_GO: "Desconozco ese lugar, no puedo ir allí",
  CANT_SAVE_THIS: "Me gustaría pero no me lo puedo guardar",
  THE_CHAISE: {
    DESCRIPTION: "a tu alrededor puedes observar: una antigua mesa de madera, una antigua mesa de madera y una antigua mesa de madera",
    OBJECTS: {
      TABLE: {
        DESCRIPTION: "una antigua mesa de madera"
      }
    }
  },
  THE_TABLE: {
    DESCRIPTION: "Esta vieja y carcomida mesa te resultaba familiar, sobre ella un tosco libro y ... un poco más abajo, un entreabierto cajón",
    OBJECTS: {
      BOOK: {
        DESCRIPTION: "Extraños cánticos guturales resuenan en tu cabeza al pasar los ojos por esas desgastadas páginas,",
        TEXT: "El elegido salvará nuestras alma entrando en el camino sin retorno, manchará la moneda maldita con su sangre y se la ofrecerá a su reflejo diciendo: el oro y mi sangre sellan el pacto, ahora te lo ofrezco"
      },
      KNIFE: {
        DESCRIPTION: "una oxidada navaja, quien sabe para que habrá sido utilizada",
        GET_OBJECT: "me la guardaré, puede ser útil más adelante"
      },
      COIN: {
        DESCRIPTION: "tal vez de oro, tal vez de plata ... una maldita moneda, tiene una extraña silueta gravada",
        GET_OBJECT: "es mi día de suerte, me la guardo"
      }
    }
  }
}
