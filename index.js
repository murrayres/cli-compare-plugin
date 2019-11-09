"use strict"

function update() {}


function compare_config(appkit, args){
  var baseapp = args.b || args.base
  var compareapp = args.c || args.compare
  var oneapp = []
  var oneappsorted = []
  var another = []
  var anothersorted = []
  console.log(baseapp)
  appkit.api.get("/apps/"+baseapp+"/config-vars", function(err1, resp1) {
       if (err1) {
           return appkit.terminal.error(err1)
       }
      oneapp = Object.keys(resp1)
      oneappsorted = oneapp.sort()
      appkit.terminal.vtable(Object.values(oneappsorted))
      console.log("")
      console.log(compareapp)
      appkit.api.get("/apps/"+compareapp+"/config-vars", function(err2, resp2) {
          if(err2){
            return appkit.terminal.error(err2)
          }
          another = Object.keys(resp2)
          anothersorted = another.sort()
          appkit.terminal.vtable(anothersorted);
          console.log("")
          console.log("diffs:")
          console.log("")
          let difference1 = oneappsorted.filter(x => !anothersorted.includes(x));
          console.log("in "+baseapp+" but not in "+compareapp)
          appkit.terminal.vtable(Object.values(difference1))
          console.log("in "+compareapp+" but not in "+baseapp)
          let difference2 = anothersorted.filter(x => !oneappsorted.includes(x));
          appkit.terminal.vtable(Object.values(difference2))
  })
 })
}


function init(appkit) {


    const compare_opts = {
        base: {
            alias: 'b',
            string: true,
            description: 'base app name',
            demand: true
        },
        compare: {
            alias: 'c',
            string: true,
            description: 'compare app name',
            demand: true
        }
    }


  appkit.args
        .command('compare:config', 'compare config vars between two apps',compare_opts, compare_config.bind(null, appkit))

}




module.exports = {
    init: init,
    update: update,
    group: 'compare',
    help: 'various tools for doing compares',
    primary: true
};

