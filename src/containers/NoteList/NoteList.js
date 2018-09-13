import React, { Component, Fragment } from "react"
import * as actions from "../../store/actions/index"
import { connect } from "react-redux"

class NoteList extends Component {
    componentDidMount() {
        this.props.dispatchGetNotes()
    }

    render() {
        return (
            <Fragment>
                {this.props.notes ? (
                    this.props.notes.map(note => <p key={note.id}>{note.content}</p>)
                ) : (
                    <p>No notes found</p>
                )}
            </Fragment>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    dispatchGetNotes: () => dispatch(actions.getNotes()),
})

const mapStateToProps = state => ({
    notes: state.note.notes,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NoteList)
