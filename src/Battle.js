var React = require('react');
var queryString = require('query-string');
var pokeApi = require('../src/api/pokeapi');
var Link = require('react-router-dom').Link;
var { wobble } = require('react-animations');
var Radium = require('radium');
var { StyleRoot } = require('radium');
var {Redirect} = require('react-router');

let styles = {
    wobble: {
        animation: 'x 1s',
        animationName: Radium.keyframes(wobble, 'wobble')
    }
}


class RedirectingClassHomePage extends React.Component{
    render(){
        return(
            <Redirect to='/' />
        )
    }
}

class RedirectingClassSelectPokemon extends React.Component{
    render(){
        return(
            <Redirect to='/SelectPokemon' />
        )
    }
}

class HeroPokemon extends React.Component {
    render() {


        let hero = this.props.hero;
        let skills = hero.pokemonSkills;
        let h_Health = this.props.heroHealth;

        var style = {
            hero: {
                backgroundColor: '#12e23b',
                borderRadius: '10px',
                width: (h_Health * 1.5) + 'px',
                height: '20px',
                border: 'white 2px solid'
                
            }
        };


        return (
            <div className='hero_Box'>
                <img className='hero_sprite' src={hero.imgSrcBack} title='HeroPokemon' alt='Your Pokemon Here' width='500' style={styles.wobble} />
                <div className='hero_Stats'>
                    <span className='sprite_Name'>{hero.pokemonName}</span><br />
                    <div className='pokemon_Health' style={style.hero}></div>
                    <p style={{ textAlign: "right" }}>{h_Health}&ensp;/&ensp;200</p>
                </div>
                <table className='moveset_tb'>
                    <tbody>
                        <tr>
                            <td className='td_left_top' onClick={() => this.props.calculateDmg()}>{skills[0]}</td>

                            <td className='td_right_top' onClick={() => this.props.calculateDmg()}>{skills[1]}</td>
                            
                            <td className='run_option' rowSpan='2'><Link className='runawaybutton' to='/SelectPokemon'>Run Away</Link></td>
                            
                        </tr>
                        <tr>
                            <td className='td_left_bot' onClick={() => this.props.calculateDmg()}>{skills[2]}</td>
                            <td className='td_right_bot' onClick={() => this.props.calculateDmg()}>{skills[3]}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

class EnemyPokemon extends React.Component {
    render() {
        let enemy = this.props.enemy;
        let e_Health = this.props.enemyHealth;


        var style = {
            enemy: {
                backgroundColor: '#12e23b',
                borderRadius: '10px',
                width: (e_Health * 1.5) + 'px',
                height: '20px',
                border: 'white 2px solid'
            }
        };

        return (

            <div className='enemy_Box'>
                <div className='enemy_Stats'>
                    <span className='sprite_Name'>{enemy.pokemonName}</span><br />
                    <div className='enemy_Health' style={style.enemy}></div>
                    <p style={{ textAlign: "right" }}>{e_Health}&ensp;/&ensp;200</p>
                </div>
                <StyleRoot>
                    <img className='enemy_sprite' src={enemy.imgSrcFront} title='EnemyPokemon' alt='Enemy Pokemon Here' width='500' style={styles.wobble} />
                </StyleRoot>
            </div>
        )
    }
}


class Battle extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            heroPokemon: [],
            enemyPokemon: [],
            heroHealth: 200,
            enemyHealth: 200,
            loading: true
        }
        this.calculateDmg = this.calculateDmg.bind(this);
        this.dealDmgToHero = this.dealDmgToHero.bind(this);
    }

    calculateDmg() {
        let dmgValue = Math.floor(Math.random() * (60 - 1) + 1);
        setTimeout(this.dealDmgToHero, 300);
        this.setState({
            enemyHealth: this.state.enemyHealth - dmgValue
        });
    }

    dealDmgToHero() {
        let returnDmg = Math.floor(Math.random() * (50 - 1) + 1);
        this.setState({
            heroHealth: this.state.heroHealth - returnDmg
        });
    }
    componentDidMount() {
        var chosenPokemon = queryString.parse(this.props.location.search);
        pokeApi.fetchCombatants(
            chosenPokemon.HeroPokemon,
            chosenPokemon.EnemyPokemon
        ).then(function (combatantResults) {
            this.setState(function () {
                return {
                    heroPokemon: combatantResults[0],
                    enemyPokemon: combatantResults[1],
                    loading: false
                }
            });
        }.bind(this));
    }


    render() {
        var loading = this.state.loading;
        if (loading === true) {
            return (
                <p>Starting up your game..</p>
            )
        }

        else if(this.state.heroHealth <= 0){
          var popuptext = window.confirm("Your pokemon has fainted! Try again?")
            if(popuptext == true){
                return(
                <RedirectingClassSelectPokemon />
                )
            }

            else if(popuptext ==false){
                return(
                <RedirectingClassHomePage />
                )
            }

            }

        else if(this.state.enemyHealth <= 0){
            var popuptext = window.confirm("Your pokemon has won! Want to try again?")
            if(popuptext == true){
                return(
                <RedirectingClassSelectPokemon />
                )
            }

            else if(popuptext ==false){
                return(
                <RedirectingClassHomePage />
                )
            }
            
        }
        else if(this.state.heroHealth && this.state.enemyHealth > 0){
            return (
                <div className='battleBox'>
                    <div className='battlegrounds'>
                        <EnemyPokemon enemy={this.state.enemyPokemon} enemyHealth={this.state.enemyHealth} />
                        <HeroPokemon hero={this.state.heroPokemon} heroHealth={this.state.heroHealth} calculateDmg={this.calculateDmg} />
                    </div>
                </div>
            )
        }
    }
}

module.exports = Battle;