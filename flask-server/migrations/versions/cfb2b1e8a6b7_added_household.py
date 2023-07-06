"""added household

Revision ID: cfb2b1e8a6b7
Revises: 
Create Date: 2023-07-04 18:39:47.822965

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cfb2b1e8a6b7'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('item', schema=None) as batch_op:
        batch_op.add_column(sa.Column('shared', sa.Boolean(), nullable=True))

    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('verfied', sa.Boolean(), nullable=True))
        batch_op.add_column(sa.Column('active', sa.Boolean(), nullable=True))
        batch_op.add_column(sa.Column('house', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(None, 'household', ['house'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('house')
        batch_op.drop_column('active')
        batch_op.drop_column('verfied')

    with op.batch_alter_table('item', schema=None) as batch_op:
        batch_op.drop_column('shared')

    # ### end Alembic commands ###