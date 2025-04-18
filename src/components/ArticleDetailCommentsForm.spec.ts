import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import ArticleDetailCommentsForm from 'src/components/ArticleDetailCommentsForm.vue'
import fixtures from 'src/utils/test/fixtures'
import { renderOptions, setupMockServer } from 'src/utils/test/test.utils.ts'

describe('# ArticleDetailCommentsForm', () => {
  let server = setupMockServer(
    ['POST', '/api/articles/*/comments', { comment: { body: 'some texts...' } }],
  )

  it('should display sign in button when user not logged', () => {
    let { container } = render(ArticleDetailCommentsForm, renderOptions({
      initialState: { user: { user: null } },
      props: { articleSlug: fixtures.article.slug },
    }))

    expect(container).toHaveTextContent('add comments on this article')
  })

  it('should display form when user logged', async () => {
    server.use(['GET', '/api/profiles/*', { profile: fixtures.author }])
    let { getByRole } = render(ArticleDetailCommentsForm, renderOptions({
      initialState: { user: { user: fixtures.user } },
      props: { articleSlug: fixtures.article.slug },
    }))
    await server.waitForRequest('GET', '/api/profiles/*')

    await fireEvent.update(getByRole('textbox', { name: 'Write comment' }), 'some texts...')
    await fireEvent.click(getByRole('button', { name: 'Submit' }))

    await server.waitForRequest('POST', '/api/articles/*/comments')
  })
})
