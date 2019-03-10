let yargonaut = require('yargonaut');
let yargs = require('yargs');

// Clear console
console.clear();


// Colorize yargs help and messages
yargonaut.helpStyle('green')
  .errorsStyle('red')
  .style('yellow', 'boolean')
  .style('yellow', 'count')
  .style('yellow', 'string')
  .style('yellow', 'array')
  .style('blue', 'required')
  .style('blue', 'default:')
  .style('blue', 'choices:')
  .style('blue', 'aliases:');

// Add all commands
yargs.commandDir('./commands', {
  extensions: process.env.NODE_ENV === 'development' ? ['js', 'ts'] : ['js'],
})
.demandCommand()
.argv;