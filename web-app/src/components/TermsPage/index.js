import React from "react"
import useAPI from "../../hooks/use-api.js"
import { styled } from "@material-ui/core/styles"
import Page from "../Page"

export default () => {
  const api = useAPI()

  return (
    <Page>
      <h1>Terms and Conditions of Use</h1>
      <h3>1. Terms</h3>
      <p>
        By accessing this web site, you are agreeing to be bound by these web
        site Terms and Conditions of Use, all applicable laws and regulations,
        and agree that you are responsible for compliance with any applicable
        local laws. If you do not agree with any of these terms, you are
        prohibited from using or accessing this site. The materials contained in
        this web site are protected by applicable copyright and trade mark law.
      </p>
      <h3>2. Use License</h3>
      <p>
        Permission is granted to click and type on the WorkTree site and create
        exactly one account. Your API usage, should you choose to use it, should
        not cause exceed more than a request every 10 seconds on average,
        considered daily.
      </p>
      <h3>3. Disclaimer</h3>
      <p>
        The materials on WorkTree's web site are provided "as is". WorkTree
        makes no warranties, expressed or implied, and hereby disclaims and
        negates all other warranties, including without limitation, implied
        warranties or conditions of merchantability, fitness for a particular
        purpose, or non-infringement of intellectual property or other violation
        of rights. Further, WorkTree does not warrant or make any
        representations concerning the accuracy, likely results, or reliability
        of the use of the materials on its Internet web site or otherwise
        relating to such materials or on any sites linked to this site.
      </p>
      <h3>4. Limitations</h3>
      <p>
        In no event shall WorkTree or its suppliers be liable for any damages
        (including, without limitation, damages for loss of data or profit, or
        due to business interruption,) arising out of the use or inability to
        use the materials on WorkTree's Internet site, even if WorkTree or a
        WorkTree authorized representative has been notified orally or in
        writing of the possibility of such damage. Because some jurisdictions do
        not allow limitations on implied warranties, or limitations of liability
        for consequential or incidental damages, these limitations may not apply
        to you.
      </p>
      <h3>5. Revisions and Errata</h3>
      <p>
        The materials appearing on WorkTree's web site could include technical,
        typographical, or photographic errors. WorkTree does not warrant that
        any of the materials on its web site are accurate, complete, or current.
        WorkTree may make changes to the materials contained on its web site at
        any time without notice. WorkTree does not, however, make any commitment
        to update the materials.
      </p>
      <h3>6. Links</h3>
      <p>
        WorkTree has not reviewed all of the sites linked to its Internet web
        site and is not responsible for the contents of any such linked site.
        The inclusion of any link does not imply endorsement by WorkTree of the
        site. Use of any such linked web site is at the user's own risk.
      </p>
      <h3>7. Site Terms of Use Modifications</h3>
      <p>
        WorkTree may revise these terms of use for its web site at any time
        without notice. By using this web site you are agreeing to be bound by
        the then current version of these Terms and Conditions of Use.
      </p>
      <h3>8. Governing Law</h3>
      <p>
        Any claim relating to WorkTree's web site shall be governed by the laws
        of the State of Delaware without regard to its conflict of law
        provisions.
      </p>
      <p>General Terms and Conditions applicable to Use of a Web Site.</p>
      <h1>Privacy Policy</h1>
      <p>
        Work Tree does not ask for any personally identifying information, any
        personally identifying information you provide is provided at your own
        risk.
      </p>
      <p>
        Work Tree uses local storage (similar to Cookies) to store session
        information.
      </p>
      <p>
        Work Tree may use third-party trackers to understand the usage of the
        site.
      </p>
    </Page>
  )
}
