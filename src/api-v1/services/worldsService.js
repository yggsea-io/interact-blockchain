let worlds = {
    Earth: {
      name: 'Earth'
    }
  };
  
  const worldsService = {
    getWorlds(name) {
      return worlds[name] ? [worlds[name]] : [];
    }
  };
  
module.exports = worldsService;