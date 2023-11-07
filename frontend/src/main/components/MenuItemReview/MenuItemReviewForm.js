import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function MenuItemReviewForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    
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

    const testIdPrefix = "MenuItemReviewForm";

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
    
    // const email_regex/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;


    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            <Row>

                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid={testIdPrefix + "-id"}
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
                        <Form.Label htmlFor="itemId">Item ID</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-itemId"}
                            id="itemId"
                            type="number"
                            isInvalid={Boolean(errors.itemId)}
                            {...register("itemId", { required: true, min: 1})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.itemId && 'Item ID is required. '}
                            {errors.itemId?.type === 'min' && 'Item ID must be greater than 1.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="dateReviewed">Date Reviewed(iso format)</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-dateReviewed"}
                            id="dateReviewed"
                            type="datetime-local"
                            isInvalid={Boolean(errors.dateReviewed)}
                            {...register("dateReviewed", { required: true, pattern: isodate_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.dateReviewed && 'DateReviewed is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>

                <Col>

                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="reviewerEmail">Reviewer Email</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-reviewerEmail"}
                            id="reviewerEmail"
                            type="text"
                            isInvalid={Boolean(errors.reviewerEmail)}
                            {...register("reviewerEmail", { required: true, pattern: email_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.reviewerEmail && "Reviewer Email is required."}
                            {errors.reviewerEmail?.type === 'pattern' && 'Reviewer email must be an email.'}
                        </Form.Control.Feedback>
                    </Form.Group>

                    </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="stars">Stars</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-stars"}
                            id="stars"
                            type="number"
                            isInvalid={Boolean(errors.stars)}
                            {...register("stars", { required: true, min: 0, max: 5})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.stars && 'Stars is required. '}
                            {(errors.stars?.type === 'min' || errors.stars?.type === 'max') && 'Stars must be between 0 and 5.'}
                        </Form.Control.Feedback>
                    </Form.Group>

                    </Col>
            </Row>

            <Row>

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="comments">Comments</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-comments"}
                            id="comments"
                            type="text"
                            isInvalid={Boolean(errors.comments)}
                            {...register("comments", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.comments && 'Comments is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>

                </Col>
            </Row>

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid="MenuItemReviewForm-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="MenuItemReviewForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default MenuItemReviewForm;


