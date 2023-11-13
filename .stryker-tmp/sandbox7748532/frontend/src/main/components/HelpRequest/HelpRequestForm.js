import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function HelpRequestForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all

    const navigate = useNavigate();

    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

    // Stryker disable next-line all
    const email_regex = /[\w.]+@([\w]+\.)+[\w-]{2,4}/i;
    // Stryker disable next-line all
    const teamId_regex = /[smfw]\d\d-([123456789]|10|11|12)(am|pm)-[1234]$/;
    // Stryker disable next-line all
    const solved_regex = /^(true|false)$/i;

    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            <Row>
                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid="HelpRequestForm-id"
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="teamId">Team ID</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-teamId"
                            id="teamId"
                            type="text"
                            isInvalid={Boolean(errors.teamId)}
                            {...register("teamId", { required: true, pattern: teamId_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.teamId && 'TeamId is required.'}
                            {errors.teamId?.type === 'pattern' && 'TeamId must be in the correct format, e.g. f23-6pm-3'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="tableOrBreakoutRoom">Table or BreakoutRoom</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-tableOrBreakoutRoom"
                            id="tableOrBreakoutRoom"
                            type="text"
                            isInvalid={Boolean(errors.tableOrBreakoutRoom)}
                            {...register("tableOrBreakoutRoom", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.tableOrBreakoutRoom && 'Table or BreakoutRoom is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="requesterEmail">Requester Email</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-requesterEmail"
                            id="requesterEmail"
                            type="text"
                            isInvalid={Boolean(errors.requesterEmail)}
                            {...register("requesterEmail", { required: true, pattern: email_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.requesterEmail && 'RequesterEmail is required.'}
                            {errors.requesterEmail?.type === 'pattern' && 'RequesterEmail must be in the email format, e.g. cgacho@ucsb.edu'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>            
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="requestTime">Request Time (iso format)</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-requestTime"
                            id="requestTime"
                            type="datetime-local"
                            isInvalid={Boolean(errors.requestTime)}
                            {...register("requestTime", { required: true, pattern: isodate_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.requestTime && 'RequestTime is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>             
            </Row>

            <Row>
            <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="explanation">Explanation</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-explanation"
                            id="explanation"
                            type="text"
                            isInvalid={Boolean(errors.explanation)}
                            {...register("explanation", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.explanation && 'Explanation is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col> 
            </Row>

            <Row>
            <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="solved">Sloved</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-solved"
                            id="solved"
                            type="text"
                            isInvalid={Boolean(errors.solved)}
                            {...register("solved", { required: true,  pattern: solved_regex})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.solved && 'Solved is required.'}
                            {errors.solved?.type === 'pattern' && 'Solved must be true or false'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col> 
            </Row>

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid="HelpRequestForm-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="HelpRequestForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default HelpRequestForm;