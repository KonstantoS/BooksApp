import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import fetchBooksData from '../actions/booksActions'
import fetchAuthorsData from '../actions/authorsActions'
import fetchGenresData from '../actions/genresActions'
import SingleBook from '../components/SingleBook'
import { LEFT_JOIN } from '../lib/data'

class BookPage extends React.Component{
    constructor(props){
        super(props);
        this.extractItemFromData = this.extractItemFromData.bind(this);
    }
    componentWillMount(){
        const { dispatch } = this.props;
        dispatch(fetchBooksData());
        dispatch(fetchGenresData());
        dispatch(fetchAuthorsData());
    }
    extractItemFromData(){
        const {id, books,authors,genres} = this.props;

        return LEFT_JOIN(
            LEFT_JOIN([books.items.find(book => {return book.id == id})],authors.items,"author","id"),
            genres.items,
            "genre","id")[0];
    }
    render(){
        const {books, authors, genres} = this.props;
        if( books.isFetching ||
            authors.isFetching ||
            genres.isFetching ||
            books.items.length == 0 ||
            authors.items.length == 0 ||
            genres.items.length == 0
        ) {
            return (
                <div className="wait-handler centered container">
                    <h3>Fetching data...</h3>
                </div>
            );
        }
        return(
            <div className="centered container">
                <SingleBook item={this.extractItemFromData()}/>
            </div>
        );
    }
}

BookPage.propTypes = {
    id: PropTypes.string.isRequired,
    authors: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        items: PropTypes.arrayOf(PropTypes.shape({
            id:PropTypes.number.isRequired,
            name:PropTypes.string.isRequired,
            img:PropTypes.string.isRequired
        })).isRequired
    }).isRequired,
    books:PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            img: PropTypes.string.isRequired,
            author: PropTypes.number.isRequired,
            desc: PropTypes.string.isRequired,
            genre: PropTypes.number.isRequired
        })).isRequired
    }).isRequired,
    genres:PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        items: PropTypes.arrayOf(PropTypes.shape({
            id:PropTypes.number.isRequired,
            title:PropTypes.string.isRequired
        })).isRequired
    }).isRequired,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return{
        id: ownProps.params.id,
        books: state.app.books,
        authors: state.app.authors,
        genres: state.app.genres
    }
};

export default connect(mapStateToProps)(BookPage);